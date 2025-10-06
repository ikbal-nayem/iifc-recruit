import { MainLayout } from '@/components/main-layout';
import { Inter, Source_Code_Pro, Space_Grotesk } from 'next/font/google';
import { Suspense } from 'react';
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

export default function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: string };
}>) {
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
				<Suspense>
					<MainLayout>{children}</MainLayout>
				</Suspense>
			</body>
		</html>
	);
}