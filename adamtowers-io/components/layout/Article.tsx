import ArticleFootnotePortal from "./ArticleFootnotePortal";

type ArticleProps = {
  children: React.ReactNode;
  footnotes?: boolean;
};

const Article = ({ footnotes, children }: ArticleProps) => {
  return (
    <article>
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
