import { colors, fonts, type Scheme } from "@/utils/brand";

// The site's mark: a "T" in the headline font on a square of the page background. For
// ImageResponse (Satori) rendering only, hence the inline flexbox styles. Used by the favicons
// and, inverted, on the Open Graph cards.
export default function Monogram({
  size,
  scheme,
  inverted = false,
}: {
  size: number;
  scheme: Scheme;
  inverted?: boolean;
}) {
  const bg = colors.bg[scheme];
  const fg = colors.fg[scheme];
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: inverted ? fg : bg,
        color: inverted ? bg : fg,
        fontFamily: fonts.headline,
        fontSize: size * 1.1,
        lineHeight: 1,
        // Playfair's line box puts the cap low; lift the T to the optical center.
        paddingBottom: size * 0.125,
      }}
    >
      T
    </div>
  );
}
