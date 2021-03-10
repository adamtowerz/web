import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import Head from "next/head";
import styles from "../styles/Home.module.scss";

const externalData = {
  "mailto:adam@towers.email": {
    label: "adam@towers.email",
    priority: 98,
    aliases: ["email", "email"],
  },
  "https://hireadam.today": {
    aliases: ["resume"],
  },
  "https://twitter.com/adamtowerz": {
    priority: 99,
    aliases: ["twitter", "twitter"],
  },
  "https://adamtowers.io": {
    priority: 100,
    aliases: ["website"],
  },
  "https://linkedin.com/in/adam-towers": {
    aliases: ["linkedin"],
  },
  "https://xkcd.com/927": {
    aliases: ["927", "standards"],
  },
  "https://justblackhats.com": {
    aliases: ["JustBlackHats"],
    priority: 96,
  },
  "https://8760app.com": {
    aliases: ["8760"],
    priority: 97,
  },
};

const pivotedExternalDate = Object.entries(externalData).reduce(
  (agg, [key, option]) => {
    option.aliases.forEach((alias) => {
      agg[alias] = {
        link: key,
        label: option.label,
        priority: option.priority || 0,
      };
    });
    return agg;
  },
  {}
);

function cleanLink(link) {
  return link.replace("https://", "").replace("http://", "");
}

function getTabCompleteText(query, options) {
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

function CliBarOption({ alias, link, label, active, onFocus }) {
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
      {options.length === 0 && (
        <div className="p-1">Nothing to see here, move along</div>
      )}
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [focusIndex, setFocusIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const inputEl = useRef(null);

  // generate the options when the query changes
  useEffect(() => {
    const newOptions = Object.entries(pivotedExternalDate)
      .filter(([key]) => key.toLowerCase().startsWith(query.toLowerCase()))
      .sort(([, aValue], [, bValue]) => aValue.priority - bValue.priority)
      .reverse()
      .slice(0, 6);

    setOptions(newOptions);
  }, [query]);

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
      setQuery(query + tabCompleteText);
      e.preventDefault();
    } else if (e.keyCode === 13) {
      // enter
      if (options.length > 0) {
        location.href = options[0][1].link;
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
    <div className={styles.container}>
      <Head>
        <title>ajt.to/</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles["cli-bar-container"]}>
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
              <span className={styles["tab-complete-text"]}>
                {tabCompleteText}
              </span>
            )}
            <CliBarOptions
              options={options}
              focusIndex={focusIndex}
              setFocusIndex={setFocusIndex}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
