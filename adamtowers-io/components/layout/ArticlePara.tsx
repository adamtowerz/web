import styles from "./ArticlePara.module.scss";
import classNames from "classnames";

type ArticleParaProps = {
  children: React.ReactNode;
  center?: boolean;
  border?: boolean;
  pad?: boolean;
};

const ArticleImage = ({ center, border, children, pad }: ArticleParaProps) => {
  return (
    <p
      className={classNames(styles.para, {
        [styles.center]: center,
        [styles.border]: border,
        [styles.pad]: pad,
      })}
    >
      {children}
    </p>
  );
};

export default ArticleImage;
