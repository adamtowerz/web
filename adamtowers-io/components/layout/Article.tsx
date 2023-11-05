import ArticleFootnotePortal from "./ArticleFootnotePortal";

type ArticleProps = {
  children: React.ReactNode;
  footnotes?: boolean;
  className?: string
};

const Article = ({ footnotes, children, className }: ArticleProps) => {
  return (
    <article className={className}>
      {children}
      {footnotes && (
        <>
          <hr />
          <ArticleFootnotePortal />
        </>
      )}
    </article>
  );
};

export default Article;
