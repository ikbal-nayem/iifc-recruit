'use client';

import { PageLoader } from '@/components/ui/page-loader';
import { ROLES } from '@/constants/auth.constant';
import { COMMON_URL } from '@/constants/common.constant';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function AuthFormsLayout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading, currectUser } = useAuth();
	const router = useRouter();

	React.useEffect(() => {
		if (!isLoading && isAuthenticated) {
			if (currectUser?.roles?.includes(ROLES.JOB_SEEKER)) {
				router.replace(ROUTES.DASHBOARD.JOB_SEEKER);
			} else {
				router.replace(ROUTES.DASHBOARD.ADMIN);
			}
		}
	}, [isLoading, isAuthenticated, currectUser, router]);

	return (
		<div className='w-full min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2'>
			<div className='hidden lg:flex flex-col items-center justify-center p-12 bg-muted/50 relative overflow-hidden'>
				<div
					className='absolute inset-0 bg-cover bg-center'
					style={{ backgroundImage: "url('/login-bg.jpg')" }}
				>
					<div className='absolute inset-0 bg-gradient-to-t from-background/80 to-transparent'></div>
				</div>
				<div className='relative text-center p-10 rounded-lg bg-white/30 backdrop-blur-sm'>
					<Image
						src={COMMON_URL.SITE_LOGO}
						alt='IIFC Logo'
						width={80}
						height={80}
						className='h-20 w-auto mx-auto mb-4'
					/>
					<h1 className='text-4xl font-headline font-bold text-primary'>Your Gateway to Opportunity</h1>
				</div>
			</div>
			<main className='flex flex-col items-center justify-center p-4 bg-background'>
				{isLoading || isAuthenticated ? <PageLoader /> : <div className='w-full max-w-sm'>{children}</div>}
			</main>
		</div>
	);
}
