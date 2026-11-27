import { ogContentType, ogImage, ogSize } from "@/utils/og";
import { SITE_DESCRIPTION } from "./shared-metadata";

// The homepage's card, with its greeting as the title.
export const alt = "Heya, I'm Adam";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: alt, description: SITE_DESCRIPTION });
}
