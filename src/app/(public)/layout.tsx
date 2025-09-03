// src/app/(public)/layout.tsx
import PublicHeader from '@/components/app/public-header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
