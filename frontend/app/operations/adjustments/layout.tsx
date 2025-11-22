import { NavWrapper } from "@/components/NavWrapper";

export default function AdjustmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavWrapper>{children}</NavWrapper>;
}
