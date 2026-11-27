import Link from "next/link";

// The year pages of the honors portfolio, each linking back to its intro.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href="/honors">Honors Portfolio</Link>
      {children}
    </>
  );
}
