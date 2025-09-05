'use client';

import Link from 'next/link';
import { Building2, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold">
        <Image src="/iifc-logo.png" alt="IIFC Logo" width={40} height={40} className="h-10 w-auto" />
        <span>IIFC Recruit</span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <Button asChild variant="ghost">
            <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
            </Link>
        </Button>
        <Button asChild>
            <Link href="/signup">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
            </Link>
        </Button>
      </div>
    </header>
  );
}
