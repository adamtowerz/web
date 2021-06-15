import classNames from "classnames";
import styles from "./ArticleCodeBlock.module.scss";

type ArticleCodeBlockProps = {
  children: React.ReactNode;
  block?: boolean;
  margin?: boolean;
};

const ArticleCodeBlock = ({
  block,
  margin,
  children,
}: ArticleCodeBlockProps) => {
  return (
    <code
      className={classNames({
        "d-block": block,
        [styles.margin]: margin,
      })}
    >
      {children}
    </code>
  );
};

export default ArticleCodeBlock;
