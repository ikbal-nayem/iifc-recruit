
import LoginForm from '@/components/app/login-form';
import Image from 'next/image';
import Link from 'next/link';
import { LoginBanner } from '@/components/app/login-banner';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-muted/50">
        <LoginBanner />
      </div>
      <main className="flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm">
           <div className="lg:hidden flex flex-col items-center justify-center space-y-4 mb-8">
             <Image src="/iifc-logo.png" alt="IIFC Logo" width={48} height={48} className="h-12 w-auto" />
            <h1 className="text-3xl font-headline font-bold text-center">
                IIFC Recruit
            </h1>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
