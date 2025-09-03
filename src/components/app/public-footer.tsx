// src/components/app/public-footer.tsx
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">IIFC Recruit</span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <Link href="#" className="text-sm hover:text-primary transition-colors">About Us</Link>
            <Link href="#" className="text-sm hover:text-primary transition-colors">Contact</Link>
            <Link href="#" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:text-primary transition-colors">Terms of Service</Link>
          </div>
          <div className="text-sm mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} IIFC Recruit. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
