'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import SidebarNav from '@/components/app/sidebar-nav';
import Header from '@/components/app/header';
import { useIsMobile } from '@/hooks/use-mobile';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  
  // By default, the sidebar is open on desktop and closed on mobile.
  // We use a key to force re-render when switching between mobile and desktop
  // to prevent hydration errors.
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, [isMobile]);


  return (
    <SidebarProvider key={key} defaultOpen={!isMobile}>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset className="flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
