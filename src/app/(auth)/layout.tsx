'use client';

import Header from '@/components/app/header';
import { InterestPromptModal } from '@/components/app/jobseeker/interest-prompt-modal';
import SidebarNav from '@/components/app/sidebar-nav';
import { PageLoader } from '@/components/ui/page-loader';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import AuthLayoutProvider from './auth-layout-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const { currectUser, clearInterestModalFlag, isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const [showInterestModal, setShowInterestModal] = useState(false);

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			const currentPath = window.location.pathname;
			const redirectUrl =
				currentPath === ROUTES.DASHBOARD.ADMIN || currentPath === ROUTES.DASHBOARD.JOB_SEEKER
					? ''
					: `?redirectUrl=${encodeURIComponent(currentPath)}`;
			router.replace(`${ROUTES.AUTH.LOGIN}${redirectUrl}`);
		}
	}, [isAuthenticated, isLoading, router]);

	useEffect(() => {
		if (currectUser?.roles.includes(ROLES.JOB_SEEKER) && currectUser.openInterestModal) {
			setShowInterestModal(true);
		}
	}, [currectUser]);

	const handleModalClose = () => {
		setShowInterestModal(false);
		clearInterestModalFlag();
	};

	if (isLoading || !isAuthenticated) {
		return <PageLoader />;
	}

	return (
		<AuthLayoutProvider>
			<Sidebar>
				<SidebarNav />
			</Sidebar>
			<SidebarInset className='flex flex-col bg-gray-200/50'>
				<Header />
				<main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>
					<Suspense fallback={<PageLoader />}>{children}</Suspense>
				</main>
			</SidebarInset>
			<InterestPromptModal isOpen={showInterestModal} onOpenChange={handleModalClose} />
		</AuthLayoutProvider>
	);
}
