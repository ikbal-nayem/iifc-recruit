'use client';

import { Toaster } from '@/components/ui/toaster';
import { TopLoader } from '@/components/ui/top-loader';
import SplashScreen from '@/components/app/splash-screen';
import { useEffect, useState } from 'react';
import { initializeAuthHeader } from '@/config/api.config';
import { SessionStorageService } from '@/services/storage.service';

const SPLASH_SHOWN_KEY = 'splash_shown';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState<boolean | null>(null);

  useEffect(() => {
    // Initialize auth header on client side
    initializeAuthHeader();
    // Check if splash screen has been shown
    const splashShown = SessionStorageService.get(SPLASH_SHOWN_KEY);
    setShowSplash(!splashShown);
    if (!splashShown) {
      SessionStorageService.set(SPLASH_SHOWN_KEY, 'true');
    }
  }, []);

  // Show nothing until we know whether to show splash screen
  if (showSplash === null) return null;

  return (
    <>
      <TopLoader />
      <Toaster />
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      {!showSplash && children}
    </>
  );
}