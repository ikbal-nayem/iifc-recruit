// src/app/layout.tsx
'use client';

import SplashScreen from '@/components/app/splash-screen';
import { Toaster } from "@/components/ui/toaster";
import { TopLoader } from '@/components/ui/top-loader';
import * as React from 'react';
import './globals.css';
import { Inter, Space_Grotesk, Source_Code_Pro } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
});

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
    <html lang={locale} className={`h-full ${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable}`}>
      <head>
        <title>IIFC Recruit</title>
        <meta name="description" content="Streamlining the recruitment process." />
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
