
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { PageLoader } from '@/components/ui/page-loader';
import { ROUTES } from '@/constants/routes.constant';

export default function JobseekerLayout({ children }: { children: React.ReactNode }) {
	const { currectUser, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading) {
			if (!currectUser) {
				router.replace(ROUTES.AUTH.LOGIN);
			} else if (currectUser.userType !== 'JOB_SEEKER') {
				router.replace(ROUTES.DASHBOARD.ADMIN);
			}
		}
	}, [isLoading, currectUser, router]);

	if (isLoading || !currectUser || currectUser.userType !== 'JOB_SEEKER') {
		return <PageLoader />;
	}

	return <>{children}</>;
}
