import { GetStaticProps, GetStaticPaths } from "next";
import Airtable from "airtable";
import { getAllPosts, getPostData } from "../../data/Blog";
import { BlogPost } from "../../types";
import hydrate from "next-mdx-remote/hydrate";
import SingleColumn from "../../components/layout/SingleColumn";

export default function Post({ post }: { post: BlogPost }) {
  const content = hydrate(post.content);
  return (
    <SingleColumn title={post.title} footer>
      <article>
        <h1>{post.title}</h1>
        {post.date_release_desc && (
          <p>
            published {post.date_release_desc}{" "}
            {post.date_edit_desc && <>, last edited {post.date_edit_desc}</>}
          </p>
        )}
        {content}
      </article>
    </SingleColumn>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_KEY,
  });
  try {
    const post = await getPostData(airtable, params.slug as string);
    return { props: { post }, revalidate: 45 };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_KEY,
  });

  const posts = await getAllPosts(airtable);
  const paths = posts.map(({ slug }) => ({
    params: {
      slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};
