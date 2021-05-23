import styles from "./ArticleImageSet.module.scss";

type ArticleImageProps = {
  children: React.ReactNode;
};

const ArticleImage = ({ children }: ArticleImageProps) => {
  return <div className={styles.articleImageSet}>{children}</div>;
};

export default ArticleImage;
