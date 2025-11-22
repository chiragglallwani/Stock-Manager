import { NavWrapper } from "@/components/NavWrapper";

export default function ReceiptLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavWrapper>{children}</NavWrapper>;
}
