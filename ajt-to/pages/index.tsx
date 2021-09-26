import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { GetServerSideProps } from "next";
import classNames from "classnames";
import Head from "next/head";

import { ApiRequest, isLoggedIn } from "../api/auth";
import { getAliases } from "../api/alias";

import styles from "../styles/Home.module.scss";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";
import useEffectExceptOnMount from "../compositions/useEffectExceptOnMount";

const AUTH_ENDPOINT = "/api/auth";
const LOGIN_ENDPOINT = `${AUTH_ENDPOINT}/login`;
const LOGOUT_ENDPOINT = `${AUTH_ENDPOINT}/logout`;
const ALIAS_ENDPOINT = "/api/alias";

type AliasData = {
  label?: string;
  priority?: number;
  link: string;
  alias: string;
};

// this is lodash.keyBy
function processLinkData(links: AliasData[]): Record<string, AliasData> {
  return links.reduce((agg, link) => {
    agg[link.alias] = link;
    return agg;
  }, {});
}

// TODO: refactor
function cleanLink(link) {
  return link
    .replace("https://", "")
    .replace("http://", "")
    .replace("mailto:", "");
}

function getTabCompleteText(query: string, options: any) {
  if (query.length === 0 || options.length === 0) {
    return null;
  }

  const remainingText = options[0][0].substring(query.length);
  if (remainingText.includes("/")) {
    return remainingText.substring(0, remainingText.indexOf("/"));
  } else {
    return remainingText;
  }
}

enum AuthState {
  LoggedOut,
  LoggedIn,
}
const AuthContext = createContext<AuthState>(AuthState.LoggedOut);

// Context value is [true, func] if `NewAliasModal` should be rendered, [false, func] otherwise.
// Invoking func sets bool to false.
const NewAliasModalContext = createContext<[boolean, (boolean) => void]>([
  false,
  () => {},
]);

interface AliasContext {
  aliases: AliasData[] | undefined;
  aliasesLoading: boolean;
  fetchAliases: () => Promise<void>;
}

// Stores link data for use in rendering and a function that re-fetches aliases
const AliasesContext = createContext<AliasContext>({
  aliases: undefined,
  aliasesLoading: false,
  fetchAliases: async () => {
    alert("default!!");
  },
});

// Fetches link data and populates the `AliasesContext`
function AliasesContextProvider({
  initialAliases,
  children,
}: {
  initialAliases: AliasData[];
  children: ReactNode;
}) {
  const [aliases, setAliases] = useState<AliasData[]>(initialAliases);
  const [loading, setLoading] = useState(false);
  const authState = useContext(AuthContext);

  const fetchLinkData = async () => {
    setLoading(true);
    try {
      const res = await fetch(ALIAS_ENDPOINT, {
        method: "GET",
      });
      const body = await res.json();
      const links = body.aliases;
      setAliases(links);
    } catch (e) {
      console.error("Failed to fetch link data");
      alert("some bad thing happened, sorry :(");
    } finally {
      setLoading(false);
    }
  };

  useEffectExceptOnMount(() => {
    fetchLinkData();
  }, [authState]);

  const aliasContext = {
    aliasesLoading: loading,
    aliases,
    fetchAliases: fetchLinkData,
  };

  return (
    <AliasesContext.Provider value={aliasContext}>
      {children}
    </AliasesContext.Provider>
  );
}

interface CliBarOptionProps {
  alias: string;
  link: string;
  label?: string;
  active: boolean;
  onFocus: () => void;
}
function CliBarOption({
  alias,
  link,
  label,
  active,
  onFocus,
}: CliBarOptionProps) {
  const [removingAlias, setRemovingAlias] = useState(false);
  const authState = useContext(AuthContext);
  const fetchLinksData = useContext(AliasesContext).fetchAliases;

  async function removeAlias() {
    setRemovingAlias(true);
    try {
      await fetch(ALIAS_ENDPOINT, {
        method: "DELETE",
        body: JSON.stringify({
          alias,
        }),
      });
      fetchLinksData();
    } catch (e) {
      alert("error, sadge");
    } finally {
      setRemovingAlias(false);
    }
  }
  return (
    <div
      onMouseEnter={onFocus}
      className={classNames(
        { [styles["active"]]: active },
        styles["cli-bar-option"]
      )}
    >
      <a href={link}>
        <span className={styles["option-alias"]}>{alias}</span>
        <span className={styles["option-label"]}>
          {label || cleanLink(link)}
        </span>
      </a>
      {authState === AuthState.LoggedIn && (
        <Button
          type="button"
          theme="link"
          className={styles["option-delete"]}
          loading={removingAlias}
          onClick={removeAlias}
        >
          x
        </Button>
      )}
    </div>
  );
}

interface NewAliasModalProps {
  open: boolean;
  onClose: () => void;
}
function NewAliasModal({ open, onClose }: NewAliasModalProps) {
  const [link, setLink] = useState("");
  const [alias, setAlias] = useState("");
  const [label, setLabel] = useState("");
  const [internal, setInternal] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLinksData = useContext(AliasesContext).fetchAliases;

  async function addAlias() {
    setIsLoading(true);
    setError(null);
    try {
      await fetch(ALIAS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          alias,
          link,
          label,
          internal,
        }),
      });
      await fetchLinksData();
    } catch {
      setError("An error occured");
    } finally {
      setIsLoading(false);
      onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={<h1>New alias</h1>}
      footer={
        <div className="d-flex">
          <Button onClick={addAlias} loading={isLoading} className="ml-auto">
            Link it up
          </Button>
        </div>
      }
    >
      <div className="row-space-between">
        <input
          autoFocus
          aria-label="Alias field"
          type="text"
          placeholder="Alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        ></input>
        <span className="pr-1"> → </span>
        <input
          aria-label="Link field"
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        ></input>
      </div>
      <div className="row-space-between py-1">
        <input
          aria-label="Label field"
          type="text"
          placeholder="Label (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        ></input>
        <span>
          <label htmlFor="internal">Internal</label>
          <input
            id="internal"
            aria-label="Internal field"
            type="checkbox"
            checked={internal}
            onChange={(e) => setInternal(e.target.checked)}
          ></input>
        </span>
      </div>
      <div>{error && <span>{error}</span>}</div>
    </Modal>
  );
}

function CliBarZeroState() {
  const isAuthed = useContext(AuthContext);
  const [_, setModalOpen] = useContext(NewAliasModalContext);
  if (!isAuthed) {
    return <div className="p-1">Nothing to see here, move along</div>;
  } else {
    return (
      <>
        <Button
          onClick={() => setModalOpen(true)}
          theme="link"
          className={styles["zero-state"]}
        >
          Nothing to see here, but there could be
        </Button>
      </>
    );
  }
}

function CliBarOptions({ options, focusIndex = 0, setFocusIndex }) {
  return (
    <div className={styles["cli-bar-options"]}>
      {options.map(([alias, value], index) => (
        <CliBarOption
          key={alias}
          alias={alias}
          link={value.link}
          label={value.label}
          active={focusIndex % options.length === index}
          onFocus={() => setFocusIndex(index)}
        />
      ))}
      {options.length === 0 && <CliBarZeroState />}
    </div>
  );
}

const MAX_SUGGESTIONS = 6;

function CliBar() {
  const [query, setQuery] = useState("");
  const [focusIndex, unsafeSetFocusIndex] = useState(0);
  const [options, setOptions] = useState([]);

  function setFocusIndex(newIndex: number) {
    if (newIndex === -1) {
      newIndex = options.length - 1;
    }

    if (newIndex > options.length || newIndex < 0) {
      unsafeSetFocusIndex(0);
    } else {
      unsafeSetFocusIndex(newIndex);
    }
  }

  const inputEl = useRef(null);
  const authState = useContext(AuthContext);
  const [_, setModalOpen] = useContext(NewAliasModalContext);
  const aliasesContext = useContext(AliasesContext);

  // generate the options when the query changes
  useEffect(() => {
    if (!aliasesContext.aliases) return;

    const linkMap = processLinkData(aliasesContext.aliases);
    const newOptions = Object.entries(linkMap)
      .filter(([key]) => key.toLowerCase().startsWith(query.toLowerCase()))
      .sort(
        ([, { priority: aPrio }], [, { priority: bPrio }]) =>
          (aPrio ?? 1000) - (bPrio ?? 1000)
      )
      .slice(0, MAX_SUGGESTIONS);

    setOptions(newOptions);
  }, [query, aliasesContext.aliases]);

  // reset the focus when the query changes
  useEffect(() => {
    setFocusIndex(0);
  }, [query]);

  const tabCompleteText = getTabCompleteText(query, options);

  function handleKeyDown(e) {
    if (e.keyCode === 38) {
      // up
      setFocusIndex(focusIndex - 1);
      e.preventDefault();
    } else if (e.keyCode === 40) {
      // down
      setFocusIndex(focusIndex + 1);
      e.preventDefault();
    } else if (e.keyCode === 9) {
      // tab
      if (tabCompleteText) {
        setQuery(query + tabCompleteText);
      }
      e.preventDefault();
    } else if (e.keyCode === 13) {
      // enter
      if (options.length > 0) {
        location.href = options[focusIndex][1].link;
      }
    }
  }

  function focusInput() {
    inputEl.current.focus();
  }

  useEffect(() => {
    focusInput();
  }, []);

  return (
    <div className={styles["cli-bar-wrapper"]}>
      <div className={styles["cli-bar"]} onClick={focusInput}>
        <h1>ajt.to/</h1>
        <input
          autoFocus
          type="text"
          ref={inputEl}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          size={query.length}
        ></input>
        {tabCompleteText && (
          <span className={styles["tab-complete-text"]}>{tabCompleteText}</span>
        )}
        {authState === AuthState.LoggedIn && (
          <Button
            className={styles["new-alias-btn"]}
            onClick={() => setModalOpen(true)}
          >
            +
          </Button>
        )}
      </div>
      <CliBarOptions
        options={options}
        focusIndex={focusIndex}
        setFocusIndex={setFocusIndex}
      />
    </div>
  );
}

interface LoginButtonProps {
  onLogin: (string) => void;
}
function LoginButton({ onLogin }: LoginButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitForm(e) {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    const auth = await fetch(`${LOGIN_ENDPOINT}`, {
      method: "POST",
      body: JSON.stringify({
        token: password,
      }),
    });

    setLoading(false);

    if (auth.ok) {
      setError(null);
      setModalOpen(false);
      onLogin(password);
    } else {
      setError("Liar, liar, liar!");
    }
  }

  return (
    <>
      <button onClick={() => setModalOpen(true)}>I'm Adam! (login)</button>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={<h1>Login!</h1>}
      >
        <>
          <p>If you're really me you'll know the super secret passcode!!</p>
          {error && <p className="red">{error}</p>}
          <form onSubmit={submitForm}>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=":D"
            />
            <Button loading={loading} type="submit">
              Login
            </Button>
          </form>
        </>
      </Modal>
    </>
  );
}

interface LogoutButtonProps {
  onLogout: () => void;
}
function LogoutButton({ onLogout }: LogoutButtonProps) {
  async function logout() {
    try {
      await fetch(`${LOGOUT_ENDPOINT}`, {
        method: "POST",
      });
      onLogout();
    } catch (e) {
      alert("oopsie, failed to log you out.");
    }
  }

  return (
    <Button type="button" onClick={logout}>
      Logout
    </Button>
  );
}

type HomePageProps = {
  isLoggedIn: boolean;
  aliases: AliasData[];
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
  return {
    props: {
      isLoggedIn: isLoggedIn(context.req as ApiRequest),
      aliases: await getAliases(context.req as ApiRequest),
    },
  };
};

export default function Home({ isLoggedIn, aliases }: HomePageProps) {
  const [authState, setAuthState] = useState<AuthState>(
    isLoggedIn ? AuthState.LoggedIn : AuthState.LoggedOut
  );

  const [newAliasModalOpen, setNewAliasModalOpen] = useState(false);

  function onLogin() {
    setAuthState(AuthState.LoggedIn);
  }

  function onLogout() {
    setAuthState(AuthState.LoggedOut);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>ajt.to/</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthContext.Provider value={authState}>
        <AliasesContextProvider initialAliases={aliases}>
          <NewAliasModalContext.Provider
            value={[newAliasModalOpen, setNewAliasModalOpen]}
          >
            <main className={styles.main}>
              <div className={styles["cli-bar-container"]}>
                <CliBar />
              </div>
            </main>
          </NewAliasModalContext.Provider>
          <NewAliasModal
            open={newAliasModalOpen}
            onClose={() => setNewAliasModalOpen(false)}
          />
        </AliasesContextProvider>
      </AuthContext.Provider>

      <footer className={styles.footer}>
        <span>
          Made by <a href="https://twitter.com/adamtowerz">Adam</a>
        </span>{" "}
        {authState === AuthState.LoggedIn ? (
          <LogoutButton onLogout={onLogout} />
        ) : (
          <LoginButton onLogin={onLogin} />
        )}
      </footer>
    </div>
  );
}
