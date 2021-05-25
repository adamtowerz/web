import styles from "./ArticleImageSet.module.scss";

type ArticleImageProps = {
  caption?: string;
  children: React.ReactNode;
};

const ArticleImage = ({ caption, children }: ArticleImageProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.articleImageSet}>{children}</div>
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
};

export default ArticleImage;
