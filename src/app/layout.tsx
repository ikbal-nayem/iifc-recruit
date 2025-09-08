
// src/app/layout.tsx
'use client';

import SplashScreen from '@/components/app/splash-screen';
import { Toaster } from "@/components/ui/toaster";
import { TopLoader } from '@/components/ui/top-loader';
import * as React from 'react';
import './globals.css';

export default function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const [isFinished, setIsFinished] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsFinished(true), 500); // Duration of fade-out animation
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <html lang={locale} className="h-full">
      <head>
        <title>IIFC Recruit</title>
        <meta name="description" content="Streamlining the recruitment process." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {!isFinished && <SplashScreen isFinished={isFinished} />}
        <TopLoader />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
