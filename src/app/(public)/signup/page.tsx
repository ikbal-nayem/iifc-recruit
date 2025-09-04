// src/app/(public)/signup/page.tsx
import { Building2 } from 'lucide-react';
import SignupForm from '@/components/app/signup-form';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="bg-primary p-3 rounded-full text-primary-foreground">
             <Building2 className="h-8 w-8" />
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
