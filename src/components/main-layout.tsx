'use client';

import { Toaster } from '@/components/ui/toaster';
import { TopLoader } from '@/components/ui/top-loader';
import SplashScreen from './splash-screen';
import { useEffect, useState } from 'react';
import { initializeAuthHeader } from '@/config/api.config';
import { SessionStorageService } from '@/services/storage.service';

const SPLASH_SHOWN_KEY = 'splash_shown';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    initializeAuthHeader();
    setIsClient(true);
    const splashShown = SessionStorageService.get(SPLASH_SHOWN_KEY);
    if (splashShown) {
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
