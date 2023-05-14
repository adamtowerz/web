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

import { getAliases } from "../api/alias";

import styles from "../styles/Home.module.scss";

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

function CliBarZeroState() {
  return <div className="p-1">Nothing to see here, move along</div>;
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
      </div>
      <CliBarOptions
        options={options}
        focusIndex={focusIndex}
        setFocusIndex={setFocusIndex}
      />
    </div>
  );
}

type HomePageProps = {
  aliases: AliasData[];
};

export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  return {
    props: {
      aliases: await getAliases(),
    },
  };
};

export default function Home({ aliases }: HomePageProps) {

  return (
    <div className={styles.container}>
      <Head>
        <title>ajt.to/</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AliasesContextProvider initialAliases={aliases}>
        <main className={styles.main}>
          <div className={styles["cli-bar-container"]}>
            <CliBar />
          </div>
        </main>
      </AliasesContextProvider>

      <footer className={styles.footer}>
        <span>
          Made by <a href="https://twitter.com/adamtowerz">Adam</a>
        </span>
      </footer>
    </div>
  );
}
