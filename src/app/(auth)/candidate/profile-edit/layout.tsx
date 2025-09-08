
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { candidateNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';

const profileTabs = candidateNavLinks.find(item => item.label === 'Edit Profile')?.submenu || [];

export default function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
     <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">
          Edit Your Profile
        </h1>
        <p className="text-muted-foreground">
          Keep your profile updated to attract the best opportunities.
        </p>
      </div>
       <div className="space-y-4">
        <div className="relative border-b">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {profileTabs.map(tab => {
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
             {children}
         </div>
       </div>
    </div>
  );
}
