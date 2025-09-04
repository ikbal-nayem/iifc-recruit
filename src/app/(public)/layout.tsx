import PublicFooter from "@/components/app/public-footer";
import PublicHeader from "@/components/app/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted min-h-screen flex flex-col">
        <PublicHeader />
        <main className="flex-1">
            {children}
        </main>
        <PublicFooter />
    </div>
  );
}
