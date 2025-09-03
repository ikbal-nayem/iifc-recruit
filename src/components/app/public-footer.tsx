// src/components/app/public-footer.tsx
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PublicFooter() {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                 <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold mb-4">
                    <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                    <Building2 className="h-7 w-7" />
                    </div>
                    <span>IIFC Recruit</span>
                </Link>
                <p className="text-muted-foreground text-sm">
                    Connecting talent with opportunity. Find your dream job or your next star hire with us.
                </p>
            </div>
            <div>
                <h4 className="font-semibold mb-4">For Candidates</h4>
                <nav className="flex flex-col gap-2">
                    <Link href="#" className="text-sm hover:text-primary transition-colors text-muted-foreground">Find a Job</Link>
                    <Link href="/login" className="text-sm hover:text-primary transition-colors text-muted-foreground">Candidate Login</Link>
                    <Link href="#" className="text-sm hover:text-primary transition-colors text-muted-foreground">Resume Builder</Link>
                </nav>
            </div>
            <div>
                <h4 className="font-semibold mb-4">For Employers</h4>
                <nav className="flex flex-col gap-2">
                    <Link href="/login" className="text-sm hover:text-primary transition-colors text-muted-foreground">Post a Job</Link>
                    <Link href="/login" className="text-sm hover:text-primary transition-colors text-muted-foreground">Employer Login</Link>
                    <Link href="#" className="text-sm hover:text-primary transition-colors text-muted-foreground">Pricing</Link>
                </nav>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <nav className="flex flex-col gap-2">
                    <Link href="#" className="text-sm hover:text-primary transition-colors text-muted-foreground">About Us</Link>
                    <Link href="#" className="text-sm hover:text-primary transition-colors text-muted-foreground">Contact</Link>
                    <Link href="#" className="text-sm hover:text-primary transition-colors text-muted-foreground">Privacy Policy</Link>
                </nav>
            </div>
        </div>
         <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} IIFC Recruit. All rights reserved.
          </div>
      </div>
    </footer>
  );
}
