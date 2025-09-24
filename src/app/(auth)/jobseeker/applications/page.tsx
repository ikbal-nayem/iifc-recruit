'use client';

import { Suspense } from 'react';
import { MyApplications } from '@/components/app/jobseeker/my-applications';
import ApplicationsLoading from './loading';

export default function JobseekerApplicationsPage() {
	return (
		<Suspense fallback={<ApplicationsLoading />}>
			<div className='space-y-8'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>My Applications</h1>
					<p className='text-muted-foreground'>
						Track the status of all your job applications.
					</p>
				</div>
				<MyApplications />
			</div>
		</Suspense>
	);
}
