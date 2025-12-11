'use client';

import { MyApplications } from '@/components/app/jobseeker/my-applications';
import { PageLoader } from '@/components/ui/page-loader';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function JobseekerApplicationsContent() {
	const searchParams = useSearchParams();
	const initialStatus = searchParams.get('status') || 'all';

	return <MyApplications initialStatusFilter={initialStatus} />;
}

export default function JobseekerApplicationsPage() {
	return (
		<div className='space-y-4'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>My Applications</h1>
				<p className='text-muted-foreground'>Track the status of all your job applications.</p>
			</div>
			<Suspense fallback={<PageLoader />}>
				<JobseekerApplicationsContent />
			</Suspense>
		</div>
	);
}
