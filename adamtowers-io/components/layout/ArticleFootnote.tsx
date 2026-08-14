"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getFootnoteContainerEl } from "./ArticleFootnotePortal";

import styles from "./ArticleFootnote.module.scss";

type ArticleFootnoteProps = {
  children: React.ReactNode;
  symbol: string;
};

const ArticleFootnote = ({ symbol, children }: ArticleFootnoteProps) => {
  // The marker renders inline with the prose, while the note body is portalled
  // into the shared container that <Article footnotes> puts at the bottom of
  // the page. That container only exists once we're mounted in the DOM, so hold
  // the portal until an effect has run.
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setContainer(getFootnoteContainerEl());
  }, []);

  return (
    <>
      <sup>
        <a id={symbol} href={`#${symbol}-note`}>
          {symbol}
        </a>
      </sup>

      {container &&
        createPortal(
          <div id={`${symbol}-note`} className={styles.footnote}>
            <sup className={styles.symbol}>
              <a href={`#${symbol}`}>{symbol}</a>
            </sup>
            <p>{children}</p>
          </div>,
          container
        )}
    </>
  );
};

export default ArticleFootnote;
