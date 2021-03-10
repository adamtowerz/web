import Link from "next/link";
import styles from "./PostList.module.scss";
import type { BlogPostMeta } from "types";
import Section from "../Section";

type Props = {
  posts: BlogPostMeta[];
};

const PostList: React.FC<Props> = ({ posts }) => {
  return (
    <Section border>
      <h2>Posts</h2>
      <ul className={styles.list}>
        {posts.map(({ slug, title, date_release_desc, date_edit_desc }) => (
          <li key={slug}>
            <Link href={`editor/${slug}`}>
              <a className={styles.listItem}>
                {title}
                <br />
                <code>{slug}</code>{" "}
                {date_release_desc && <>- {date_release_desc}</>}
                {date_edit_desc && <>, edited {date_edit_desc}</>}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
};

export default PostList;
