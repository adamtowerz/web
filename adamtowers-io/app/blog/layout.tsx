import SingleColumn from "@/components/layout/SingleColumn";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SingleColumn footer>{children}</SingleColumn>;
}
