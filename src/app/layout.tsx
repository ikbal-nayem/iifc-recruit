// src/app/layout.tsx
'use client';

import SplashScreen from '@/components/app/splash-screen';
import { Toaster } from '@/components/ui/toaster';
import { TopLoader } from '@/components/ui/top-loader';
import { SessionStorageService } from '@/services/storage.service';
import { Inter, Source_Code_Pro, Space_Grotesk } from 'next/font/google';
import * as React from 'react';
import './globals.css';

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

const SPLASH_SHOWN_KEY = 'splash_shown';

export default function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
	const [isFinished, setIsFinished] = React.useState(false);
	const [showSplash, setShowSplash] = React.useState(false);

	React.useEffect(() => {
		const splashShown = SessionStorageService.get(SPLASH_SHOWN_KEY);
		if (!splashShown) {
			setShowSplash(true);
			const timeout = setTimeout(() => {
				setIsFinished(true);
				SessionStorageService.set(SPLASH_SHOWN_KEY, 'true');
			}, 1500); // Increased duration for a better first-load experience
			return () => clearTimeout(timeout);
		} else {
			setShowSplash(false);
			setIsFinished(true);
		}
	}, []);

	return (
		<html
			lang={locale}
			className={`h-full ${inter.variable} ${spaceGrotesk.variable} ${sourceCodePro.variable}`}
		>
			<head>
				<title>IIFC Jobs</title>
				<meta name='description' content='Streamlining the recruitment process.' />
			</head>
			<body className='font-body antialiased flex flex-col min-h-screen'>
				{showSplash && <SplashScreen isFinished={isFinished} />}
				<TopLoader />
				{children}
				<Toaster />
			</body>
		</html>
	);
}
