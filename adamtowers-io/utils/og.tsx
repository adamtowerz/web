import type { Metadata } from "next";
import { ImageResponse } from "next/og";
import { colors, fonts, loadFonts } from "@/utils/brand";
import Monogram from "@/utils/Monogram";

// Open Graph cards, drawn at build time with the site's own colors and fonts (see utils/brand.ts).
// Each route's opengraph-image.tsx re-exports these with its own title and description.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const scheme = "light" as const;

export async function ogImage({ title, description }: { title: string; description?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: colors.bg[scheme],
          color: colors.fg[scheme],
          fontFamily: fonts.text,
        }}
      >
        {/* The favicon's mark, beside the site name. */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Monogram size={72} scheme={scheme} inverted />
          <div style={{ fontFamily: fonts.headline, fontSize: 40 }}>Adam Towers</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontFamily: fonts.headline, fontSize: 76, lineHeight: 1.1 }}>{title}</div>
          {description && (
            <div style={{ fontSize: 34, lineHeight: 1.4, opacity: 0.75 }}>{description}</div>
          )}
        </div>
      </div>
    ),
    { ...ogSize, fonts: await loadFonts() },
  );
}

// Title and description from a page's own `metadata` export, so a page's card can't drift from it.
export function ogFromMetadata(metadata: Metadata) {
  return {
    title: String(metadata.title),
    description: metadata.description ?? undefined,
  };
}
