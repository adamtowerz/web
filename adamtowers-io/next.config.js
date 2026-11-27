const createMDX = require("@next/mdx");

// Blog posts and the honors portfolio are page.mdx files (see mdx-components.tsx).
const withMDX = createMDX();

module.exports = withMDX({
  reactCompiler: true,
  pageExtensions: ["ts", "tsx", "mdx"],
});
