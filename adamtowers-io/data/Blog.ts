import type Airtable from "airtable";
import type { BlogPost, BlogPostMeta, BlogPostStatus } from "../types";
import renderToString from "next-mdx-remote/render-to-string";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}, ${date.getHours()}:${date.getMinutes()}`;
}

export async function getAllPosts(
  airtable: Airtable,
  showPrivate: boolean = false
): Promise<BlogPostMeta[]> {
  let records = [];
  try {
    records = await airtable
      .base("appga5u4QI2sqDov4")("Blog")
      .select({
        fields: ["slug", "status", "title", "date_release", "date_edit"],
      })
      .all();
  } catch (e) {
    console.error(e);
  }

  const posts: BlogPostMeta[] = records.map((record) => {
    const post: BlogPostMeta = {
      slug: record.get("slug") as string,
      status: record.get("status") as BlogPostStatus,
      title: record.get("title") ?? ("" as string),
    };

    if (record.get("date_release")) {
      post.date_release = formatDate(record.get("date_release"));
    }
    if (record.get("date_edit")) {
      post.date_edit = formatTime(record.get("date_edit"));
    }

    return post;
  });

  if (showPrivate) {
    return posts;
  } else {
    return posts.filter((record) => record.status !== "private");
  }
}

export async function getPostData(
  airtable: Airtable,
  slug: string,
  renderContent = true
): Promise<BlogPost> {
  const records = await airtable
    .base("appga5u4QI2sqDov4")("Blog")
    .select({
      maxRecords: 1,
      filterByFormula: `{slug} = '${slug}'`,
      fields: [
        "slug",
        "status",
        "title",
        "date_release",
        "date_edit",
        "content",
      ],
    })
    .all();

  if (records.length < 1) {
    throw new Error("No records found for slug");
  }

  const content = renderContent
    ? await renderToString(records[0].get("content"))
    : records[0].get("content");

  const blogPost: BlogPost = {
    slug: records[0].get("slug"),
    status: records[0].get("status") ?? "private",
    title: records[0].get("title") ?? "Untitled",
    content: content ?? "",
  };

  let date_release = records[0].get("date_release");
  if (date_release) {
    blogPost.date_release = date_release;
    blogPost.date_release_desc = formatDate(date_release);
  }

  let date_edit = records[0].get("date_edit");
  if (date_edit) {
    blogPost.date_edit = date_edit;
    blogPost.date_edit_desc = formatTime(date_edit);
  }

  return blogPost;
}

export async function updatePostBySlug(airtable: Airtable, post: BlogPost) {
  const records = await airtable
    .base("appga5u4QI2sqDov4")("Blog")
    .select({
      maxRecords: 1,
      filterByFormula: `{slug} = '${post.slug}'`,
      fields: [],
    })
    .all();
  const id = records[0].id;

  await airtable
    .base("appga5u4QI2sqDov4")("Blog")
    .update([
      {
        id,
        fields: {
          slug: post.slug,
          title: post.title,
          status: post.status,
          content: post.content,
          date_release: post.date_release,
          date_edit: post.date_edit,
        },
      },
    ]);
}

export async function createBlankPost(airtable: Airtable, slug: string) {
  return airtable
    .base("appga5u4QI2sqDov4")("Blog")
    .create([
      {
        fields: {
          slug,
          status: "private",
        },
      },
    ]);
}
