
import SignupForm from '@/components/app/signup-form';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-between p-12 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: "url('/login-bg.jpg')" }}>
        <div className="self-start">
            <Link href="/" className="flex items-center gap-3 font-headline text-2xl font-bold text-white">
                <Image src="/iifc-logo-white.png" alt="IIFC Logo" width={40} height={40} className="h-10 w-auto" />
                <span>IIFC Recruit</span>
            </Link>
        </div>
        <div className="text-center text-white p-6 bg-black/50 rounded-lg">
            <h1 className="text-4xl font-bold font-headline">Let's get you started</h1>
            <p className="text-white/80 mt-2">Create an account to begin your journey with us.</p>
        </div>
        <div className="text-xs text-white/70">
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
          <SignupForm />
        </div>
      </main>
    </div>
  );
}
