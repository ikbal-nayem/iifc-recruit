
import SignupForm from '@/components/app/signup-form';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="w-full lg:min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-muted/50 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/login-bg.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center">
          <Image src="/iifc-logo.png" alt="IIFC Logo" width={80} height={80} className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-4xl font-headline font-bold text-primary">
            Your Gateway to Opportunity
          </h1>
        </div>
      </div>
      <main className="flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </main>
    </div>
  );
}
