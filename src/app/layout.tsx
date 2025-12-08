import { MainLayout } from '@/components/main-layout';
import { AuthProvider } from '@/contexts/auth-context';
import { LocaleProvider } from '@/contexts/locale-context';
import { Lato } from 'next/font/google';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import './globals.css';
import { headers } from 'next/headers';

const lato = Lato({
	subsets: ['latin'],
	variable: '--font-lato',
	weight: ['300', '400', '700', '900'],
});

const kalpurush = localFont({ src: '../../public/fonts/kalpurush.woff2', variable: '--font-kalpurush' });

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const headersList = await headers();
	const locale = headersList.get('x-locale') || 'en';

	return (
		<html lang={locale} className={`h-full ${lato.variable} ${kalpurush.variable}`}>
			<head>
				<title>IIFC Outsourcing Jobs</title>
				<meta name='description' content='Streamlining the recruitment process.' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
			</head>
			<body className='font-body antialiased flex flex-col min-h-screen'>
				<Suspense>
					<LocaleProvider>
						<AuthProvider>
							<MainLayout>{children}</MainLayout>
						</AuthProvider>
					</LocaleProvider>
				</Suspense>
			</body>
		</html>
	);
}
