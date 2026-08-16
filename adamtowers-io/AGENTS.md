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
- **Tailwind CSS v4**, CSS-first config. There is **no `tailwind.config.js`** — the entire config is
  `@import "tailwindcss";` in `styles/tailwind.css`. Use the v4 postfix important syntax (`mb-0!`),
  not the v3 prefix form (`!mb-0`).
- **pnpm**, pinned via `packageManager`.

## Layout

```
app/            routes (App Router). Server Components by default.
components/     shared components; components/layout/* are the article/page primitives
styles/         base.css (reset), theme.scss (CSS custom properties), tailwind.css, pages/*.module.scss
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

Three layers coexist deliberately; don't consolidate them without being asked:

1. **CSS custom properties** in `styles/theme.scss` — colors, type scale, `--brand-border`. This is
   the source of truth for theming.
2. **SCSS modules** for component styles.
3. **Tailwind utilities** for layout, mostly on newer pages like `app/page.tsx`.

Dark mode is driven by the `prefers-color-scheme` media query in `theme.scss` (and, in
`HeroImage`, a `matchMedia` listener) — **not** Tailwind's `dark:` variant or a class toggle.

Fonts load through `next/font/google` in `app/layout.tsx` and are exposed to CSS as
`--font-family-headline` / `--font-family-text`. Reference those variables rather than importing
fonts again.

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

There is no `public/favicon.ico`. Add one at `app/favicon.ico` if you want Next to wire it up.

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
