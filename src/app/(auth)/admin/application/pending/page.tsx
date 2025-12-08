import { RequestedPostsList } from '@/components/app/admin/application/requested-posts-list';
import { JobRequestedPostStatus, JobRequestStatus } from '@/interfaces/job.interface';

const filterableStatuses = [
	{ value: 'all', nameEn: 'All' },
	{ value: JobRequestedPostStatus.PENDING, nameEn: 'Pending' },
	{ value: JobRequestedPostStatus.CIRCULAR_PUBLISHED, nameEn: 'Circular Published' },
];

export default function PendingApplicationsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Pending Applications</h1>
					<p className='text-muted-foreground'>Review and prepare all incoming job posts for processing.</p>
				</div>
			</div>
			<RequestedPostsList
				statusIn={[JobRequestedPostStatus.PENDING, JobRequestedPostStatus.CIRCULAR_PUBLISHED]}
				requestStatusNotIn={[JobRequestStatus.PENDING]}
				filterableStatuses={filterableStatuses}
			/>
		</div>
	);
}
