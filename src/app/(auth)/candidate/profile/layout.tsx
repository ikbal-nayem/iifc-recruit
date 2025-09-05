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

const profileTabs = [
    { value: 'personal', label: 'Personal Info', href: '/candidate/profile' },
    { value: 'academic', label: 'Academic', href: '/candidate/profile/academic' },
    { value: 'professional', label: 'Professional', href: '/candidate/profile/professional' },
    { value: 'skills', label: 'Skills', href: '/candidate/profile/skills' },
    { value: 'certifications', label: 'Certifications', href: '/candidate/profile/certifications' },
    { value: 'languages', label: 'Languages', href: '/candidate/profile/languages' },
    { value: 'publications', label: 'Publications', href: '/candidate/profile/publications' },
    { value: 'awards', label: 'Awards', href: '/candidate/profile/awards' },
];


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
    if (lastSegment === 'profile') return 'personal';
    return profileTabs.find(tab => tab.href === pathname)?.value || 'personal';
  }

  const [activeTab, setActiveTab] = React.useState(getCurrentTab());
  
  React.useEffect(() => {
    setActiveTab(getCurrentTab());
  }, [pathname]);

  const handleTabChange = (value: string) => {
    const href = profileTabs.find(tab => tab.value === value)?.href;
    if (href) {
        router.push(href);
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
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <TabsList className="bg-background">
                {profileTabs.map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value} asChild>
                        <Link href={tab.href}>{tab.label}</Link>
                    </TabsTrigger>
                ))}
            </TabsList>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="mt-4">
             {children}
        </div>
        </Tabs>
    </div>
  );
}
