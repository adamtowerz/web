import { ImageResponse } from "next/og";
import { colors, fonts, loadFonts, type Scheme } from "@/utils/brand";

// The site's icons: a "T" in the headline font, in the page's own colors. Rendered at build time,
// one PNG per color scheme, and wired up (with media queries for the scheme) in app/layout.tsx.
// The App Router's icon file conventions can't target a color scheme, so this is a plain route.
const ICONS: Record<string, { scheme: Scheme; size: number }> = {
  "light.png": { scheme: "light", size: 64 },
  "dark.png": { scheme: "dark", size: 64 },
  // iOS home screens don't follow the color scheme, so the touch icon is light only.
  "apple-touch.png": { scheme: "light", size: 180 },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(ICONS).map((name) => ({ name }));
}

export async function GET(_request: Request, { params }: RouteContext<"/icons/[name]">) {
  const { scheme, size } = ICONS[(await params).name];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.bg[scheme],
          color: colors.fg[scheme],
          fontFamily: fonts.headline,
          fontSize: size * 1.1,
          lineHeight: 1,
          // Playfair's line box puts the cap low; lift the T to the optical center.
          paddingBottom: size * 0.125,
        }}
      >
        T
      </div>
    ),
    { width: size, height: size, fonts: await loadFonts() },
  );
}
