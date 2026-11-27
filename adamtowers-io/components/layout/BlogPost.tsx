import Article from "./Article";
import styles from "../../styles/pages/blog/blog.module.css";

// The article wrapper for a blog post's page.mdx, which uses it as its MDX layout.
const BlogPost = ({ footnotes, children }: { footnotes?: boolean; children: React.ReactNode }) => {
  return (
    <Article footnotes={footnotes} className={styles.slug}>
      {children}
    </Article>
  );
};

export default BlogPost;
