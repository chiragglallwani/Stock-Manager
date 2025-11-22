import { NavWrapper } from "@/components/NavWrapper";

export default function WarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavWrapper>{children}</NavWrapper>;
}
