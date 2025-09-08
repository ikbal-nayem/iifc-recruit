
'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { candidateNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

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
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
         <Card className="md:col-span-1 glassmorphism">
            <CardContent className="p-2">
                <nav className="flex flex-col space-y-1">
                    {profileTabs.map(tab => (
                        <Link 
                            key={tab.href} 
                            href={tab.href}
                            className={cn(
                                "py-2 px-4 rounded-md text-sm font-medium transition-colors",
                                (tab.isActive ? tab.isActive(pathname) : pathname === tab.href)
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted/50"
                            )}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </nav>
            </CardContent>
         </Card>
         <div className="md:col-span-3">
             {children}
         </div>
       </div>
    </div>
  );
}

    