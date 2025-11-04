'use client';

import { Toaster } from '@/components/ui/toaster';
import { TopLoader } from '@/components/ui/top-loader';
import SplashScreen from './splash-screen';
import { useEffect, useState } from 'react';
import { SessionStorageService } from '@/services/storage.service';

const SPLASH_SHOWN_KEY = 'splash_shown';

export function MainLayout({ children }: { children: React.ReactNode }) {
	const [isClient, setIsClient] = useState(false);
	const [showSplash, setShowSplash] = useState(true);

	useEffect(() => {
		setIsClient(true);
		// This logic now runs only on the client, after the initial render
		if (SessionStorageService.get(SPLASH_SHOWN_KEY)) {
			setShowSplash(false);
		} else {
			SessionStorageService.set(SPLASH_SHOWN_KEY, 'true');
		}
	}, []);

	// On the server, and for the very first client render, showSplash will always be true,
	// matching the server output.
	if (showSplash) {
		return <SplashScreen onFinish={() => setShowSplash(false)} />;
	}
	
	// Once the splash screen is finished, or if it was never shown on subsequent loads, render the main content.
	return (
		<>
			<TopLoader />
			<Toaster />
			{children}
		</>
	);
}
