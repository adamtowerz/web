// page.mdx files export their route metadata, which the opengraph-image.tsx beside each one
// imports. @types/mdx only types the default export.
declare module "*.mdx" {
  export const metadata: import("next").Metadata;
}
