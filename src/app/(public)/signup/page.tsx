
import SignupForm from '@/components/app/signup-form';
import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col items-center justify-center bg-primary text-primary-foreground p-12 relative">
        <div className="absolute inset-0 bg-primary/90" />
        <Image
            src="https://picsum.photos/seed/signup/1200/1800"
            alt="Recruitment background"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
            data-ai-hint="people working"
        />
        <div className="relative z-10 text-center">
            <Link href="/" className="flex items-center gap-3 justify-center font-headline text-3xl font-bold mb-4">
                <Image src="/iifc-logo.png" alt="IIFC Logo" width={48} height={48} className="h-12 w-auto bg-white/20 rounded-lg p-1" />
                <span>IIFC Recruit</span>
            </Link>
            <p className="max-w-md text-lg">
                Join our network of skilled professionals and find your next opportunity for growth.
            </p>
        </div>
      </div>
      <main className="flex flex-col items-center justify-center p-4">
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
