// This file is no longer used for the main public layout.
// It is now handled by src/app/[locale]/layout.tsx
// I am leaving this file but removing its content to prevent build issues
// or moving it to the new [locale] structure.
// For now, it will just pass children through.

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
