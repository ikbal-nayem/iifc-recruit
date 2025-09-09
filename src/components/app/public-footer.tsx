'use client';

import Link from 'next/link';
import { Building2, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function PublicFooter() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                 <Link href="/" className="flex items-center gap-3 font-headline text-2xl font-bold mb-4">
                    <Image src="/iifc-logo.png" alt="IIFC Logo" width={40} height={40} className="h-10 w-auto" />
                    <span>IIFC Jobs</span>
                </Link>
                <p className="text-muted-foreground text-sm mb-4">
                    Connecting talent with opportunity. Find your dream job or your next star hire with us.
                </p>
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Twitter className="h-5 w-5"/></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Github className="h-5 w-5"/></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#"><Linkedin className="h-5 w-5"/></Link>
                    </Button>
                </div>
            </div>
            <div>
                <h4 className="font-semibold mb-4">For Candidates</h4>
                <nav className="flex flex-col gap-2">
                    <Link href="/" className="text-sm hover:text-primary transition-colors text-muted-foreground">Find a Job</Link>
                    <Link href="/login" className="text-sm hover:text-primary transition-colors text-muted-foreground">Candidate Login</Link>
                    <Link href="/signup" className="text-sm hover:text-primary transition-colors text-muted-foreground">Candidate Sign Up</Link>
                </nav>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Our Work</h4>
                <nav className="flex flex-col gap-2">
                    <Link href="/services" className="text-sm hover:text-primary transition-colors text-muted-foreground">Our Services</Link>
                    <Link href="/projects" className="text-sm hover:text-primary transition-colors text-muted-foreground">Our Projects</Link>
                    <Link href="/sectors" className="text-sm hover:text-primary transition-colors text-muted-foreground">Sectors</Link>
                </nav>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <nav className="flex flex-col gap-2">
                    <Link href="/about" className="text-sm hover:text-primary transition-colors text-muted-foreground">About Us</Link>
                    <Link href="/contact" className="text-sm hover:text-primary transition-colors text-muted-foreground">Contact</Link>
                    <Link href="#" className="text-sm hover:text-primary transition-colors text-muted-foreground">Privacy Policy</Link>
                </nav>
            </div>
        </div>
         <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} IIFC Jobs. All rights reserved.
          </div>
      </div>
    </footer>
  );
}
