import { NavWrapper } from "@/components/NavWrapper";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavWrapper>{children}</NavWrapper>;
}
