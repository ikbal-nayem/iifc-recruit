'use client';

import * as React from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { candidateNavLinks } from '@/lib/nav-links';

const profileTabs = candidateNavLinks.find(item => item.label === 'Edit Profile')?.submenu || [];


export default function CandidateProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getCurrentTab = () => {
    const segments = pathname.split('/');
    const lastSegment = segments[segments.length - 1];
    // if lastSegment is not in profileTabs values, default to personal
    if (lastSegment === 'profile-edit' || !profileTabs.some(tab => tab.href.endsWith(lastSegment))) {
        return 'profile-edit';
    }
    return lastSegment;
  }
  
  const [activeTab, setActiveTab] = React.useState(getCurrentTab());
  
  React.useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [pathname]);

  const handleTabChange = (value: string) => {
    const tab = profileTabs.find(tab => (tab.href.split('/').pop() || 'profile') === value);
    if (tab) {
        router.push(tab.href);
    }
  };


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
       <Tabs value={activeTab} onValueChange={handleTabChange}>
        <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                {profileTabs.map(tab => {
                     const value = tab.href.split('/').pop() || 'profile';
                    return (
                        <TabsTrigger key={value} value={value} asChild>
                            <Link href={tab.href}>{tab.label}</Link>
                        </TabsTrigger>
                    )
                })}
            </TabsList>
            <ScrollBar orientation="horizontal" className="invisible"/>
        </ScrollArea>
        <div className="mt-6">
             {children}
        </div>
        </Tabs>
    </div>
  );
}
