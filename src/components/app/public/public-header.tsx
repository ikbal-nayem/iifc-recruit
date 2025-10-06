
'use client';

import Link from 'next/link';
import { Building2, LogIn, UserPlus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useState } from 'react';

export default function PublicHeader() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const navLinks = [
      { href: '/jobs', label: 'Find a Job' },
  ];

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6">
      <Link href="/" className="flex items-center gap-2 font-headline text-xl font-bold mr-6">
        <Image src="/iifc-logo.png" alt="IIFC Logo" width={40} height={40} className="h-10 w-auto" />
        <span className="hidden sm:inline-block">IIFC Jobs</span>
      </Link>

      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
         {navLinks.map(link => (
          <Link 
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors hover:text-primary",
              pathname === link.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
            </Link>
        </Button>
        <Button asChild className="hidden sm:inline-flex">
            <Link href="/signup">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
            </Link>
        </Button>
         <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
            </SheetHeader>
            <nav className="grid gap-6 text-lg font-medium mt-8">
              {navLinks.map(link => (
                  <SheetClose asChild key={link.href}>
                    <Link 
                        href={link.href}
                        className={cn(
                        "transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        {link.label}
                    </Link>
                 </SheetClose>
              ))}
               <hr className="my-4"/>
               <SheetClose asChild>
                 <Link href="/login" className="text-muted-foreground">Sign In</Link>
               </SheetClose>
                <SheetClose asChild>
                 <Link href="/signup" className="text-muted-foreground">Sign Up</Link>
               </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
