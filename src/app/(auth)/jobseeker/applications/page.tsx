
'use client';

import { Suspense } from 'react';
import { MyApplications } from '@/components/app/jobseeker/my-applications';
import ApplicationsLoading from './loading';
import { useSearchParams } from 'next/navigation';

function JobseekerApplicationsContent() {
	const searchParams = useSearchParams();
	const initialStatus = searchParams.get('status') || 'all';

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>My Applications</h1>
				<p className='text-muted-foreground'>Track the status of all your job applications.</p>
			</div>
			<MyApplications initialStatusFilter={initialStatus} />
		</div>
	);
}

export default function JobseekerApplicationsPage() {
	return (
		<Suspense fallback={<ApplicationsLoading />}>
			<JobseekerApplicationsContent />
		</Suspense>
	);
}
