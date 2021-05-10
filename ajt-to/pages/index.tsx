import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
  ReactNode,
} from "react";
import classNames from "classnames";
import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { Modal } from "../components/Modal";
import { Button } from "../components/Button";

const AUTH_ENDPOINT = "/api/auth";
const ALIAS_ENDPOINT = "/api/alias";
const LOCAL_TOKEN_KEY = "LOCAL_TOKEN_KEY";
const LOCAL_ALIASES_KEY = "LOCAL_ALIASES_KEY";

let localLoginTokenCache = undefined;
function getLocalLogin(): string | null {
  if (localLoginTokenCache !== undefined) {
    return localLoginTokenCache;
  }

  localLoginTokenCache = localStorage.getItem(LOCAL_TOKEN_KEY);
  if (localLoginTokenCache === "null") {
    localLoginTokenCache = null; // lmfao, thanks JavaScript
  }
  return localLoginTokenCache;
}

function setLocalLogin(token: string) {
  localStorage.setItem(LOCAL_TOKEN_KEY, token);
  localLoginTokenCache = token;
}

let localAliasCache = undefined;
function getLocalAliases(): AliasData[] | null {
  if (localAliasCache !== undefined) {
    return localAliasCache;
  }

  if (!process.browser) {
    return undefined;
  }

  localAliasCache = JSON.parse(localStorage.getItem(LOCAL_ALIASES_KEY));
  return localAliasCache;
}

function setLocalAliases(aliases: AliasData[]) {
  localStorage.setItem(LOCAL_TOKEN_KEY, JSON.stringify(aliases));
  localAliasCache = aliases;
}

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

// Context value is auth token is exists and valid, otherwise null
const TokenContext = createContext(null);

enum AuthState {
  LoggedOut,
  LoggedIn,
  Resolving,
}
const AuthContext = createContext<AuthState>(AuthState.Resolving);

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
function AliasesContextProvider({ children }: { children: ReactNode }) {
  const [linksData, setLinksData] = useState<AliasData[]>(getLocalAliases());
  const [loading, setLoading] = useState(false);
  const token = useContext(TokenContext);
  const authState = useContext(AuthContext);

  const fetchLinkData = async () => {
    if (authState === AuthState.Resolving) return;

    setLoading(true);
    const headers = token
      ? {
          Authorization: `Basic ${token}`,
        }
      : {};
    const res = await fetch(ALIAS_ENDPOINT, {
      method: "GET",
      headers,
    });

    if (res.ok) {
      const links = (await res.json()).aliases;
      setLinksData(links);
      setLocalAliases(links);
    } else {
      console.error("Failed to fetch link data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinkData();
  }, [authState]);

  const aliasContext = {
    aliasesLoading: loading,
    aliases: linksData,
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

function CliBar() {
  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(0);
  const [options, setOptions] = useState([]);

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
        ([, { priority: aPrio = 1 }], [, { priority: bPrio = 1 }]) =>
          aPrio - bPrio
      )
      .reverse()
      .slice(0, 6);

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

    const auth = await fetch(`${AUTH_ENDPOINT}`, {
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
  return (
    <Button type="button" onClick={onLogout}>
      Logout
    </Button>
  );
}

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>(AuthState.Resolving);
  const [token, setToken] = useState<string | null>(null);
  const isLoggedIn = authState === AuthState.LoggedIn;

  const [newAliasModalOpen, setNewAliasModalOpen] = useState(false);

  useEffect(() => {
    const token = getLocalLogin();
    setToken(token);
    setAuthState(token !== null ? AuthState.LoggedIn : AuthState.LoggedOut);
  }, []);

  function onLogin(token) {
    setLocalLogin(token);
    setToken(token);
    setAuthState(AuthState.LoggedIn);
  }

  function onLogout() {
    setLocalLogin(null);
    setLocalAliases(null);
    setToken(null);
    setAuthState(AuthState.LoggedOut);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>ajt.to/</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthContext.Provider value={authState}>
        <TokenContext.Provider value={token}>
          <AliasesContextProvider>
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
        </TokenContext.Provider>
      </AuthContext.Provider>

      <footer className={styles.footer}>
        <span>
          Made by <a href="https://twitter.com/adamtowerz">Adam</a>
        </span>{" "}
        {isLoggedIn ? (
          <LogoutButton onLogout={onLogout} />
        ) : (
          <LoginButton onLogin={onLogin} />
        )}
      </footer>
    </div>
  );
}
