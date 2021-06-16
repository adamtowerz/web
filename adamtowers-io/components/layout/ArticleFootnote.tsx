import ReactDOM from "react-dom";
import { getFootnoteContainerEl } from "./ArticleFootnotePortal";

import styles from "./ArticleFootnote.module.scss";

type ArticleFootnoteProps = {
  children: React.ReactNode;
  symbol: string;
};

const ArticleFootnote = ({ symbol, children }: ArticleFootnoteProps) => {
  if (!process.browser) return null;
  const el = getFootnoteContainerEl();

  return (
    <>
      <sup>
        <a id={symbol} href={`#${symbol}-note`}>
          {symbol}
        </a>
      </sup>

      {ReactDOM.createPortal(
        <div id={`${symbol}-note`} className={styles.footnote}>
          <sup className={styles.symbol}>
            <a href={`#${symbol}`}>{symbol}</a>
          </sup>
          <p>{children}</p>
        </div>,
        el
      )}
    </>
  );
};

export default ArticleFootnote;
