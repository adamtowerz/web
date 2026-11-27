import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// How markdown in the page.mdx files renders. Markdown links can't carry attributes, so
// links to this site's routes go through next/link and everything else opens in a new tab.
const components: MDXComponents = {
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} target="_blank" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
