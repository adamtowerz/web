import { ogContentType, ogFromMetadata, ogImage, ogSize } from "@/utils/og";
import { metadata } from "./page.mdx";

// This page's card, from its own title and description.
export const alt = String(metadata.title);
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage(ogFromMetadata(metadata));
}
