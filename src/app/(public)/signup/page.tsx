// src/app/(public)/signup/page.tsx
import { Building2 } from 'lucide-react';
import SignupForm from '@/components/app/signup-form';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
           <div className="bg-background p-2 rounded-lg text-primary-foreground shadow-md">
             <Image src="https://iifc.gov.bd/images/iifc-logo.jpg" alt="IIFC Logo" width={48} height={48} className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-center">
            Join IIFC Recruit
          </h1>
          <p className="text-muted-foreground text-center">
            Create an account to start your job search.
          </p>
        </div>
        <SignupForm />
      </div>
    </main>
  );
}
