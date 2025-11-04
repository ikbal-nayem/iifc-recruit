'use client';

import { Toaster } from '@/components/ui/toaster';
import { TopLoader } from '@/components/ui/top-loader';
import SplashScreen from './splash-screen';
import { useEffect, useState } from 'react';
import { SessionStorageService } from '@/services/storage.service';

const SPLASH_SHOWN_KEY = 'splash_shown';

export function MainLayout({ children }: { children: React.ReactNode }) {
	const [showSplash, setShowSplash] = useState(true);

	useEffect(() => {
		if (SessionStorageService.get(SPLASH_SHOWN_KEY)) {
			setShowSplash(false);
		} else {
			const timer = setTimeout(() => {
				setShowSplash(false);
				SessionStorageService.set(SPLASH_SHOWN_KEY, 'true');
			}, 2000); // Same duration as splash animation
			return () => clearTimeout(timer);
		}
	}, []);

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
