'use client';

import Header from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import { InterestPromptModal } from '@/components/app/jobseeker/interest-prompt-modal';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { ROLES } from '@/constants/auth.constant';
import { useAuth } from '@/contexts/auth-context';
import React, { Suspense, useEffect, useState } from 'react';
import AuthLayoutProvider from './auth-layout-provider';
import { PageLoader } from '@/components/ui/page-loader';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const { currectUser, clearInterestModalFlag } = useAuth();
	const [showInterestModal, setShowInterestModal] = useState(false);

	useEffect(() => {
		// Show interest modal if the flag is set for jobseekers
		if (currectUser?.roles.includes(ROLES.JOB_SEEKER) && currectUser.openInterestModal) {
			setShowInterestModal(true);
		}
	}, [currectUser]);


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
					<Suspense fallback={<PageLoader />}>{children}</Suspense>
				</main>
			</SidebarInset>
			<InterestPromptModal isOpen={showInterestModal} onOpenChange={handleModalClose} />
		</AuthLayoutProvider>
	);
}
