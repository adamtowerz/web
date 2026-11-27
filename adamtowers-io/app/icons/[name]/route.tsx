import { ImageResponse } from "next/og";
import { loadFonts, type Scheme } from "@/utils/brand";
import Monogram from "@/utils/Monogram";

// The site's icons: the monogram in the page's own colors. Rendered at build time, one PNG per
// color scheme, and wired up (with media queries for the scheme) in app/layout.tsx. The App
// Router's icon file conventions can't target a color scheme, so this is a plain route.
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
  return new ImageResponse(<Monogram size={size} scheme={scheme} />, {
    width: size,
    height: size,
    fonts: await loadFonts(),
  });
}
