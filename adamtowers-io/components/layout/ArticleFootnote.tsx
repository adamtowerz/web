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
        <a href={`#${symbol}`}>{symbol}</a>
      </sup>

      {ReactDOM.createPortal(
        <div id={symbol} className={styles.footnote}>
          <div className={styles.symbol}>{symbol}</div>
          <p>{children}</p>
        </div>,
        el
      )}
    </>
  );
};

export default ArticleFootnote;
