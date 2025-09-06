
import LoginForm from '@/components/app/login-form';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-between bg-foreground text-background p-12">
        <div className="self-start">
            <Link href="/" className="flex items-center gap-3 font-headline text-2xl font-bold">
                <Image src="/iifc-logo-white.png" alt="IIFC Logo" width={40} height={40} className="h-10 w-auto" />
                <span>IIFC Recruit</span>
            </Link>
        </div>
        <div className="text-center">
            <h1 className="text-4xl font-bold font-headline">Let's get you started</h1>
            <p className="text-background/70 mt-2">Access your account and find your next opportunity.</p>
        </div>
        <div className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} IIFC Recruit. All Rights Reserved.
        </div>
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

