'use client';

import * as React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AuthLayoutProvider({ children }: { children: React.ReactNode }) {
	const isMobile = useIsMobile();

	// By default, the sidebar is open on desktop and closed on mobile.
	// We use a key to force re-render when switching between mobile and desktop
	// to prevent hydration errors.
	const [key, setKey] = React.useState(0);
	React.useEffect(() => {
		setKey((prev) => prev + 1);
	}, [isMobile]);

	return (
		<SidebarProvider key={key} defaultOpen={!isMobile}>
			{children}
		</SidebarProvider>
	);
}