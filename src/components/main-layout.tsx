'use client';

import { Toaster } from '@/components/ui/toaster';
import { TopLoader } from '@/components/ui/top-loader';
import SplashScreen from './splash-screen';
import { useEffect, useState } from 'react';
import { initializeAuthHeader } from '@/config/api.config';
import { SessionStorageService } from '@/services/storage.service';

const SPLASH_SHOWN_KEY = 'splash_shown';

export function MainLayout({ children }: { children: React.ReactNode }) {
	const [isClient, setIsClient] = useState(false);
	const [showSplash, setShowSplash] = useState(true);

	useEffect(() => {
		setIsClient(true);
		initializeAuthHeader();

		if (SessionStorageService.get(SPLASH_SHOWN_KEY)) {
			setShowSplash(false);
		} else {
			SessionStorageService.set(SPLASH_SHOWN_KEY, 'true');
		}
	}, []);

	if (!isClient) {
		return null;
	}

	return (
		<>
			<TopLoader />
			<Toaster />
			{showSplash ? <SplashScreen onFinish={() => setShowSplash(false)} /> : children}
		</>
	);
}
