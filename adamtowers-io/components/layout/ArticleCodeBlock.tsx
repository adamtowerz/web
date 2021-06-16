import classNames from "classnames";
import styles from "./ArticleCodeBlock.module.scss";

type ArticleCodeBlockProps = {
  children: React.ReactNode;
  block?: boolean;
};

const ArticleCodeBlock = ({ block, children }: ArticleCodeBlockProps) => {
  return (
    <code
      className={classNames(styles.codeBlock, {
        [styles.block]: block,
      })}
    >
      {children}
    </code>
  );
};

export default ArticleCodeBlock;
