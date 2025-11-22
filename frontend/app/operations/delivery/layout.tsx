import { NavWrapper } from "@/components/NavWrapper";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavWrapper>{children}</NavWrapper>;
}
