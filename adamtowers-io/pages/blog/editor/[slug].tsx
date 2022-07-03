import { GetServerSideProps } from "next";
import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import SingleColumn from "@/components/layout/SingleColumn";
import Section from "@/components/Section";
import Airtable from "airtable";
import { getPostData } from "data/Blog";
import { BlogPost, BlogPostStatus } from "types";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import styles from "./[slug].module.scss";
import { isWriteEnabled } from "@/utils/server";

type Props = {
  post: BlogPost;
};

const BLOG_STATUSES: BlogPostStatus[] = ["published", "private", "unlisted"];

export default function EditPost({ post }: Props) {
  const [originalPost, setOriginalPost] = useState(post);
  const [title, setTitle] = useState(post.title);
  const handleTitleChange = (e: any) => setTitle(e.target.value);

  const [content, setContent] = useState(post.content);
  const handleContentChange = (e: any) => setContent(e.target.value);

  const [status, setStatus] = useState(post.status);
  const handleStatusChange = (e: any) => setStatus(e.target.value);

  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const newPost = { ...post, title, content, status };

    const res = await fetch("/api/blog", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: newPost }),
    });

    if (res.ok) {
      const body = await res.json();
      console.log(body);
      setOriginalPost(body.post);
    } else {
      alert("save failed, ruh roh");
    }

    setIsSaving(false);
  };

  const canSave =
    title !== originalPost.title ||
    content != originalPost.content ||
    status !== originalPost.status;

  return (
    <SingleColumn
      title="Blog Post Editor"
      header={
        <header className={styles.header}>
          <h1>Edit Post</h1>
          <Button onClick={save} disable={!canSave}>
            Save
          </Button>
        </header>
      }
      footer
    >
      <Section border>
        <Input
          type="text"
          value={title}
          placeholder="Post Title"
          onChange={handleTitleChange}
          fullWidth
          noBorder
        />
        <span className={styles.slug}>
          Slug: <code>{post.slug}</code>
        </span>
        <Select
          value={status}
          options={BLOG_STATUSES}
          onChange={handleStatusChange}
          noBorder
          label="Status:"
          block
        />
      </Section>
      <Section border>
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Lorem ipsum, latin latin latin..."
          noBorder
        />
      </Section>
    </SingleColumn>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  if (!isWriteEnabled()) {
    return {
      notFound: true,
    };
  }

  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_KEY,
  });
  try {
    const post = await getPostData(airtable, params.slug as string, false);
    return { props: { post } };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};
