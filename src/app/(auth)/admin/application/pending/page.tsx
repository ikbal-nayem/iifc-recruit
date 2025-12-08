'use client';

import { RequestedPostsList } from '@/components/app/admin/application/requested-posts-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobRequestedPostStatus, JobRequestStatus } from '@/interfaces/job.interface';
import { useState } from 'react';

const TABS = {
	ALL: 'all',
	PENDING: JobRequestedPostStatus.PENDING,
	PUBLISHED: JobRequestedPostStatus.CIRCULAR_PUBLISHED,
};

export default function PendingApplicationsPage() {
	const [activeTab, setActiveTab] = useState(TABS.ALL);

	const getStatusIn = () => {
		switch (activeTab) {
			case TABS.PENDING:
				return [JobRequestedPostStatus.PENDING];
			case TABS.PUBLISHED:
				return [JobRequestedPostStatus.CIRCULAR_PUBLISHED];
			default:
				return [JobRequestedPostStatus.PENDING, JobRequestedPostStatus.CIRCULAR_PUBLISHED];
		}
	};

	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Pending Applications</h1>
					<p className='text-muted-foreground'>Review and prepare all incoming job posts for processing.</p>
				</div>
			</div>
			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='grid w-full grid-cols-3 max-w-lg mx-auto bg-white rounded-lg'>
					<TabsTrigger value={TABS.ALL}>All</TabsTrigger>
					<TabsTrigger value={TABS.PENDING}>Pending</TabsTrigger>
					<TabsTrigger value={TABS.PUBLISHED}>Circular Published</TabsTrigger>
				</TabsList>
				<TabsContent value={activeTab} className='mt-4'>
					<RequestedPostsList statusIn={getStatusIn()} requestStatusNotIn={[JobRequestStatus.PENDING]} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
