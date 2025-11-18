import { MainLayout } from '@/components/main-layout';
import { AuthProvider } from '@/contexts/auth-context';
import { Lato } from 'next/font/google';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import './globals.css';
import '@/lib/i18n';

const lato = Lato({
	subsets: ['latin'],
	variable: '--font-lato',
	weight: ['300', '400', '700', '900'],
});

const kalpurush = localFont({ src: '../../public/fonts/kalpurush.woff2', variable: '--font-kalpurush' });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang={'en'} className={`h-full ${lato.variable} ${kalpurush.variable}`}>
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
