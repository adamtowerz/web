import styles from "./ArticleSection.module.scss";

type ArticleSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ArticleSection = ({ title, children }: ArticleSectionProps) => {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
};

export default ArticleSection;
