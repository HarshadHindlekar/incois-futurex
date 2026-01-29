import { Header } from "@/components/common";

export default function AdvisoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header alertCount={3} />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
