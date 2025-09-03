// src/components/app/public-header.tsx
'use client';

import Link from 'next/link';
import { Building2, LogIn, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold">
        <div className="bg-primary p-2 rounded-lg text-primary-foreground">
          <Building2 className="h-7 w-7" />
        </div>
        <span>IIFC Recruit</span>
      </Link>
      <nav className="flex-1 flex justify-center items-center gap-6">
         <Link href="/" className={cn("text-base font-medium transition-colors hover:text-primary", pathname === '/' ? 'text-primary' : 'text-muted-foreground')}>
            Find a Job
          </Link>
          <Link href="#" className={cn("text-base font-medium transition-colors hover:text-primary", pathname === '/companies' ? 'text-primary' : 'text-muted-foreground')}>
            Companies
          </Link>
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
            <Link href="/login">
                <Plus className="mr-2 h-4 w-4" />
                Post a Job
            </Link>
        </Button>
        <Button asChild>
            <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
            </Link>
        </Button>
      </div>
    </header>
  );
}
