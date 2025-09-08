
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
        <div className="relative">
          <div className="flex flex-wrap items-center gap-1">
            {profileTabs.map(tab => (
                <Link 
                    key={tab.href} 
                    href={tab.href}
                    className={cn(
                        "py-2 px-4 text-sm font-medium transition-colors rounded-md",
                        (tab.isActive ? tab.isActive(pathname) : pathname === tab.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                >
                    {tab.label}
                </Link>
            ))}
          </div>
        </div>
         <div className="pt-4">
             {children}
         </div>
       </div>
    </div>
  );
}
