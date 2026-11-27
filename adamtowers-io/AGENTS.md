# adamtowers-io

Adam Towers' personal site: a small Next.js App Router site (landing page, two blog posts, an
honors portfolio). Static — every route prerenders, there is no database, API, or auth.

This directory is one project inside the `web` repo, which is a loose monorepo with no workspace
tooling. Each project (`adamtowers-io`, `ajt-to`, `cards`, `dropdown`) is standalone — run all
commands from this directory, not the repo root. The repo root does have a `package.json`, but
it only exists to pin `packageManager` for Vercel's Corepack detection (which reads that field
from the true repo root, not the project's configured Root Directory); it has no dependencies
and isn't a workspace root.

## Commands

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # also runs typecheck
pnpm start
npx tsc --noEmit   # typecheck alone
```

There is no test suite, linter, or formatter configured. `pnpm build` is the check that matters.

## Stack, and where it differs from what you probably expect

- **Next.js 16, App Router.** Turbopack is the **default bundler** — do not add a `--turbopack`
  flag, it is redundant. `--webpack` opts back out.
- **React 19 + React Compiler** (`reactCompiler: true` in `next.config.js`). The compiler handles
  memoization. **Do not add `useMemo`, `useCallback`, or `memo`** — hand-memoization is noise here,
  and in some cases blocks the compiler from optimizing. Write plain components.
- **TypeScript 7.** `baseUrl` was **removed** in TS7. Path aliases in `tsconfig.json` must be
  relative (`"./components/*"`, not `"components/*"`). If you touch the aliases, keep the leading
  `./` or the build fails with TS5090.
- **Tailwind CSS v4**, CSS-first config. There is **no `tailwind.config.js`** — the config is the
  `@import "tailwindcss"` and `@theme` block at the top of `styles/globals.css`. You should not
  need `!` overrides (see Styling); if you do, use the v4 postfix form (`mb-0!`), not `!mb-0`.
- **pnpm 12**, pinned via `packageManager` (here and in the repo-root `package.json` — keep them
  in sync). `pnpm-workspace.yaml` sets `virtualStoreType: project` on purpose: a global virtual
  store symlinks `node_modules/next` outside the project, and Turbopack refuses to resolve it
  ("Could not find the Next.js package").

## Layout

```
app/            routes (App Router). Server Components by default.
components/     shared components; components/layout/* are the article/page primitives
styles/         globals.css (Tailwind, design tokens, element and prose defaults), pages/*.module.css
public/honors/  portfolio images
```

Import via the `@/components/*` alias (the dominant style). `@/utils/*` is also aliased but
`utils/` does not exist. Stylesheets are imported by relative path — there is no alias for them.

Blog posts and portfolio pages are **hand-authored TSX**, not MDX or CMS content. Prose lives
inside the component tree, composed from `Article`, `ArticleSection`, `ArticlePara`,
`ArticleImage`, `ArticleCodeBlock`. Follow that pattern when adding a page.

Indentation is inconsistent across the codebase (4-space in `app/page.tsx` and `HeroImage.tsx`,
2-space in `components/layout/`). Match the file you are editing rather than reformatting it.

## Styling

All global CSS is `styles/globals.css`. There is no Sass; stylesheets are plain CSS using native
nesting.

1. **Design tokens** are the `@theme static` block: `--color-bg`, `--color-fg`, `--color-code`,
   `--color-accent`, `--font-headline`, `--font-text`, `--font-mono`, and the type scale
   (`--text-h1`..`--text-h3`, `--text-small`). Each is a CSS variable and a Tailwind utility
   (`text-fg`, `bg-code`, `text-small`, `font-headline`). It's `static` so every variable is
   emitted even when no utility uses it — CSS modules reference them, and Tailwind doesn't scan
   those. Add new colors and sizes here rather than hard-coding them.
2. **Element defaults** (headings, lists, links, `hr`, `code`) are in `@layer base`, and the prose
   rules for `<article>` in `@layer components`. Because they're layered, Tailwind utilities
   always beat them, with no `!`.
3. **CSS modules** (`*.module.css`) for component styles. These are unlayered, so they beat
   utilities on the same element; prefer one or the other per element.
4. **Tailwind utilities** for layout, mostly on newer pages like `app/page.tsx`.

Dark mode comes from `color-scheme: light dark` plus `light-dark()` in the color tokens (and, in
`HeroImage`, a `matchMedia` listener) — **not** Tailwind's `dark:` variant or a class toggle.
Colors written as tokens adapt automatically; don't hard-code a light-only color.

Fonts load through `next/font/google` in `app/layout.tsx`, which exposes them as
`--font-playfair` / `--font-pt-serif`; `globals.css` maps those to the `--font-headline` and
`--font-text` tokens. Use the tokens rather than importing fonts again. All headings use the
headline font.

`components/HeroImage.tsx` is the only `'use client'` component: a WebGPU canvas with a CRT
post-processing pass, typed by `@webgpu/types`. It randomizes its color on mount inside an effect
specifically to avoid a hydration mismatch — keep any new randomness client-only for the same
reason.

## Metadata

Titles and social tags come from the App Router Metadata API. `SingleColumn` does **not** handle
them — it used to, via `next/head`, which is inert in the App Router and left the whole site with
no `<title>` at all.

Site-wide defaults (title template, description, OG, Twitter) live in `app/layout.tsx`. Per-route
metadata goes through `pageMetadata()` in `app/shared-metadata.ts`. **Use that helper rather than
writing `openGraph` inline**: Next replaces a parent's `openGraph` object wholesale instead of
merging field by field, so a page that sets `openGraph: { title }` silently drops `siteName` from
the root layout. Passing `description: undefined` likewise overrides the inherited description
instead of falling back to it.

`app/not-found.tsx` cannot export metadata — the App Router only supports that on
`global-not-found.js` (experimental, off here). The 404 page inherits the default title, and Next
injects `noindex` on 404s automatically.

## Generated images

Favicons and Open Graph cards are drawn in code with `ImageResponse` at build time, not stored
as files.

- **Favicons:** `app/icons/[name]/route.tsx` renders the `Monogram` (`utils/Monogram.tsx`, a "T"
  in the headline font), one PNG per color scheme. The root layout's `metadata.icons` picks
  between them with `prefers-color-scheme` media queries. (The App Router's `icon` file
  convention can't target a color scheme, which is why it's a plain route.)
- **Open Graph cards:** every page with metadata has an `opengraph-image.tsx` beside it that
  imports that page's own `metadata` and renders it with `ogImage()` from `utils/og.tsx`, so the
  card can't drift from the page's title and description. Add one when you add a page. The
  homepage's card is `app/opengraph-image.tsx`, which other routes without their own (like the
  404) fall back to. Next fills in `twitter:image` from these too.

`utils/brand.ts` is the shared source for anything drawn this way. It reads colors out of the
`light-dark()` tokens in `styles/globals.css` and fetches the same Google fonts as TrueType (what
`ImageResponse` needs), so generated images follow the site's styles. It does need network
access at build time, as `next/font/google` already does. If you change a font in
`app/layout.tsx`, change it in `utils/brand.ts` too: `next/font` only accepts literals, so the
two can't share a constant.

## Footnotes

`<ArticleFootnote symbol="1">` renders its marker inline and portals the note body into the
container that `<Article footnotes>` places at the bottom. It is a Client Component because the
portal target only exists after mount. Only pass `footnotes` to `Article` on pages that actually
have footnotes, or you get a stray `<hr>` and an empty container.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
