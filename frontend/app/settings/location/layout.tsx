import { NavWrapper } from "@/components/NavWrapper";

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavWrapper>{children}</NavWrapper>;
}
