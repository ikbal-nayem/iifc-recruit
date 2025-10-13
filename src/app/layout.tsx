import { MainLayout } from '@/components/main-layout';
import { Outfit, Poppins, Source_Code_Pro } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

const poppins = Poppins({
	subsets: ['latin'],
	variable: '--font-poppins',
	weight: ['300', '400', '500', '600', '700'],
});

const outfit = Outfit({
	subsets: ['latin'],
	variable: '--font-outfit',
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
			className={`h-full ${poppins.variable} ${outfit.variable} ${sourceCodePro.variable}`}
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
