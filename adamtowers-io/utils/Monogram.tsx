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
        // Sized and lifted for Grenze's metrics so the T's cap fills about 3/4 of the square and
        // sits at the optical center. Re-measure if the headline font changes.
        fontSize: size * 1.28,
        lineHeight: 1,
        paddingBottom: size * 0.14,
      }}
    >
      T
    </div>
  );
}
