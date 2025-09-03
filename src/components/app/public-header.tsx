// src/components/app/public-header.tsx
'use client';

import Link from 'next/link';
import { Building2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold">
        <div className="bg-primary p-2 rounded-lg text-primary-foreground">
          <Building2 className="h-6 w-6" />
        </div>
        <span>IIFC Recruit</span>
      </Link>
      <nav className="flex-1 flex justify-center items-center">
         <Link href="/jobs" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/jobs' ? 'text-primary' : 'text-muted-foreground')}>
            Job Listings
          </Link>
      </nav>
      <Button asChild>
        <Link href="/">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
    </header>
  );
}
