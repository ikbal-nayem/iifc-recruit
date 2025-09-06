import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SplashScreenProps {
    isFadingOut: boolean;
}

export default function SplashScreen({ isFadingOut }: SplashScreenProps) {
  return (
    <div className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-out",
        isFadingOut ? "opacity-0" : "opacity-100"
      )}>
      <div className="flex flex-col items-center gap-4">
        <Image src="/iifc-logo.png" alt="IIFC Logo" width={80} height={80} className="h-20 w-auto" />
        <h1 className="text-4xl font-headline font-bold">IIFC Recruit</h1>
        <div className="mt-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        <p className="mt-2 text-muted-foreground">Loading, please wait...</p>
      </div>
    </div>
  );
}
