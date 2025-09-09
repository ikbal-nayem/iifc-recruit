import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
    isFinished: boolean;
}

export default function SplashScreen({ isFinished }: SplashScreenProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <div className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-out",
        isFinished ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
      <div className="flex flex-col items-center gap-4">
        <Image src="/iifc-logo.png" alt="IIFC Logo" width={80} height={80} className="h-20 w-auto animate-pulse" />
        <h1 className="text-4xl font-headline font-bold">IIFC Jobs</h1>
        <div className="flex justify-center items-center space-x-2 mt-4">
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
        </div>
        <p className="mt-2 text-muted-foreground">Loading, please wait...</p>
      </div>
    </div>
  );
}
