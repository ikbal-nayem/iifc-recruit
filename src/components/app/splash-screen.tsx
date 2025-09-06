import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Image src="/iifc-logo.png" alt="IIFC Logo" width={80} height={80} className="h-20 w-auto" />
        <h1 className="text-4xl font-headline font-bold">IIFC Recruit</h1>
        <div className="mt-4 h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        <p className="mt-2 text-muted-foreground">Loading, please wait...</p>
      </div>
    </div>
  );
}
