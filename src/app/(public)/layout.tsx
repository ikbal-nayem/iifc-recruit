
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted min-h-screen flex flex-col">
        <main className="flex-1">
            {children}
        </main>
    </div>
  );
}
