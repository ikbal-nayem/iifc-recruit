
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { adminNavLinks } from '@/lib/nav-links';

const masterDataTabs = adminNavLinks.find(item => item.label === 'Master Data')?.submenu || [];

export default function MasterDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
     <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          Master Data Configuration
        </h1>
        <p className="text-muted-foreground">
          Manage the core data used across the application.
        </p>
      </div>
       <div className="space-y-4">
        <div className="relative border-b">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {masterDataTabs.map(tab => {
                if (tab.href.includes('locations')) return null;
                const isActive = tab.isActive ? tab.isActive(pathname) : pathname === tab.href;
                return (
                    <Link 
                        key={tab.href} 
                        href={tab.href}
                        className={cn(
                            "py-3 px-1 text-sm font-medium transition-colors relative",
                            isActive
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                        {isActive && (
                        <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                        )}
                    </Link>
                )
            })}
          </div>
        </div>
         <div className="pt-4">
             {children