import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Section from "@/components/Section";

const NewPost: React.FC = () => {
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSlugChange = (e: any) => setSlug(e.target.value);
  const canCreate = slug.length > 0;

  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });
    setLoading(false);
    router.push(`/blog/editor/${slug}`);
  };

  return (
    <Section border>
      <h2>New Post</h2>
      <form onSubmit={createPost}>
        <Input
          type="text"
          placeholder="slug"
          value={slug}
          onChange={handleSlugChange}
        />
        <Button loading={loading} disable={!canCreate} type="submit">
          Create Post
        </Button>
      </form>
    </Section>
  );
};

export default NewPost;
