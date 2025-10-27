import { AuthProvider } from '@/contexts/auth-context';
import { MainLayout } from '@/components/main-layout';
import { Lato, Source_Code_Pro } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

const lato = Lato({
	subsets: ['latin'],
	variable: '--font-lato',
	weight: ['300', '400', '700', '900'],
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
			className={`h-full ${lato.variable} ${sourceCodePro.variable}`}
		>
			<head>
				<title>IIFC Jobs</title>
				<meta name='description' content='Streamlining the recruitment process.' />
			</head>
			<body className='font-body antialiased flex flex-col min-h-screen'>
				<Suspense>
					<AuthProvider>
						<MainLayout>{children}</MainLayout>
					</AuthProvider>
				</Suspense>
			</body>
		</html>
	);
}
