import { Header } from "@/components/common";

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header alertCount={3} />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
