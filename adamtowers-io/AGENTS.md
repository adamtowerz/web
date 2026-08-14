# adamtowers-io

Adam Towers' personal site: a small Next.js App Router site (landing page, two blog posts, an
honors portfolio). Static — every route prerenders, there is no database, API, or auth.

This directory is one project inside the `web` repo, which is a loose monorepo: there is **no root
`package.json` and no workspace tooling**. Each project (`adamtowers-io`, `ajt-to`, `cards`,
`dropdown`) is standalone. Run all commands from this directory, not the repo root.

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

## Known-broken legacy code

These predate the App Router migration. They compile, so the build won't warn you. Don't copy these
patterns, and if you touch one of these files, fix it properly:

- **`components/layout/SingleColumn.tsx` uses `next/head`**, a Pages Router API that is a silent
  no-op in the App Router. The consequence is real and verified: built pages ship with **no
  `<title>` and no OG tags at all**. Fixing this means exporting a `metadata` object from each
  route (or `generateMetadata`) and deleting the `<Head>` block.
- **`components/layout/ArticleFootnote.tsx` guards on `process.browser`**, which was removed in
  Next 12 and is now always `undefined`. Every footnote therefore renders `null` — the concerns
  post has 7 footnotes and displays none of them. It also calls `ReactDOM.createPortal` from a
  Server Component. A fix needs `'use client'` plus a real mount check.
- **`components/ErrorPage.tsx` uses the Next 12 `<Link><a>` pattern**, which no longer works. The
  file is dead code — nothing imports it. Prefer deleting it over fixing it. `app/not-found.tsx`
  already does the same job correctly.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
