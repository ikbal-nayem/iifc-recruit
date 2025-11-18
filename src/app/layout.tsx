// This file is intentionally left blank as the root layout is now managed in src/app/[locale]/layout.tsx
// to support next-intl's URL-based routing. Keeping this file might interfere with the build process,
// but for now, we'll clear its content to avoid conflicts.
// The primary layout logic is now in src/app/[locale]/layout.tsx.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
