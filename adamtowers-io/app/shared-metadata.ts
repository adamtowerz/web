import type { Metadata } from "next";

export const SITE_NAME = "Adam Towers";

/**
 * Build per-route metadata.
 *
 * Use this rather than writing `openGraph` inline on a page: Next replaces the
 * parent's `openGraph` object wholesale instead of merging field by field, so a
 * page that sets `openGraph: { title }` silently drops `siteName` and friends
 * from the root layout. Going through here keeps the shared fields attached.
 */
export function pageMetadata({
  title,
  description,
  type = "website",
}: {
  title: string;
  description?: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type,
    },
  };
}
