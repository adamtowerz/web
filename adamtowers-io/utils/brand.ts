// The site's look for images generated at build time (favicons, Open Graph cards), taken from
// the same sources as the page itself so the two can't drift apart: colors are read out of the
// design tokens in styles/globals.css, and fonts are the same Google fonts app/layout.tsx loads.
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export type Scheme = "light" | "dark";

const globalsCss = await readFile(join(process.cwd(), "styles/globals.css"), "utf8");

// Reads a `--name: light-dark(<light>, <dark>)` token from globals.css.
function schemeToken(name: string): Record<Scheme, string> {
  const match = globalsCss.match(
    new RegExp(`--${name}:\\s*light-dark\\(\\s*([^,]+?)\\s*,\\s*([^)]+?)\\s*\\)`),
  );
  if (!match) throw new Error(`--${name} is not a light-dark() token in styles/globals.css`);
  return { light: match[1], dark: match[2] };
}

export const colors = {
  bg: schemeToken("color-bg"),
  fg: schemeToken("color-fg"),
};

// Google fonts, as TrueType: ImageResponse can't read the woff2 next/font serves to the page.
// Google answers clients that don't look like a browser with TrueType URLs.
async function googleFont(family: string, weight: number): Promise<ArrayBuffer> {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}`)
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`No TrueType source for ${family} ${weight}`);
  return (await fetch(url)).arrayBuffer();
}

// Keep these in step with the next/font calls in app/layout.tsx, which only accept literals.
const HEADLINE = { name: "Grenze", weight: 600 } as const;
const TEXT = { name: "PT Serif", weight: 400 } as const;

export const fonts = {
  headline: HEADLINE.name,
  text: TEXT.name,
};

export async function loadFonts() {
  const [headline, text] = await Promise.all([
    googleFont(HEADLINE.name, HEADLINE.weight),
    googleFont(TEXT.name, TEXT.weight),
  ]);
  return [
    { name: HEADLINE.name, data: headline, weight: HEADLINE.weight, style: "normal" as const },
    { name: TEXT.name, data: text, weight: TEXT.weight, style: "normal" as const },
  ];
}
