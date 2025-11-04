
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
	}, []);

	useEffect(() => {
		if (isClient) {
			if (SessionStorageService.get(SPLASH_SHOWN_KEY)) {
				setShowSplash(false);
			} else {
				const timer = setTimeout(() => {
					setShowSplash(false);
					SessionStorageService.set(SPLASH_SHOWN_KEY, 'true');
				}, 2000); // Same duration as splash animation
				return () => clearTimeout(timer);
			}
		}
	}, [isClient]);

	if (!isClient || showSplash) {
		return <SplashScreen onFinish={() => setShowSplash(false)} />;
	}

	return (
		<>
			<TopLoader />
			<Toaster />
			{children}
		</>
	);
}
