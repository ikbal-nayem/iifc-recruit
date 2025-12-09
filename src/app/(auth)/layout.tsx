'use client';

import Header from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import { InterestPromptModal } from '@/components/app/jobseeker/interest-prompt-modal';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import AuthLayoutProvider from './auth-layout-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const { currectUser, isAuthenticated, isLoading, clearInterestModalFlag } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [showInterestModal, setShowInterestModal] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			if (!isAuthenticated || !currectUser) {
				router.replace(ROUTES.AUTH.LOGIN);
				return;
			}

			// Show interest modal if the flag is set for jobseekers
			if (currectUser.roles.includes(ROLES.JOB_SEEKER) && currectUser.openInterestModal) {
				setShowInterestModal(true);
			}

			const isJobseeker = currectUser.roles.includes(ROLES.JOB_SEEKER);
			const isAdminPath = pathname.startsWith('/admin');
			const isJobseekerPath = pathname.startsWith('/jobseeker');

			if (isAdminPath && isJobseeker) {
				router.replace(ROUTES.DASHBOARD.JOB_SEEKER);
			} else if (isJobseekerPath && !isJobseeker) {
				router.replace(ROUTES.DASHBOARD.ADMIN);
			}
		}
	}, [isLoading, isAuthenticated, currectUser, pathname, router]);

	if (isLoading || !isAuthenticated) {
		return (
			<div className='flex h-screen items-center justify-center'>
				<Skeleton className='h-32 w-32 rounded-full' />
			</div>
		);
	}

	const handleModalClose = () => {
		setShowInterestModal(false);
		clearInterestModalFlag();
	};

	return (
		<AuthLayoutProvider>
			<Sidebar>
				<SidebarNav />
			</Sidebar>
			<SidebarInset className='flex flex-col bg-gray-200/50'>
				<Header />
				<main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>
					<Suspense
						fallback={
							<div className='space-y-4'>
								<Skeleton className='mx-auto h-4 w-1/2 mb-4' />
								<Skeleton className='mx-auto h-8 w-1/4' />
							</div>
						}
					>
						{children}
					</Suspense>
				</main>
			</SidebarInset>
			<InterestPromptModal isOpen={showInterestModal} onOpenChange={handleModalClose} />
		</AuthLayoutProvider>
	);
}
