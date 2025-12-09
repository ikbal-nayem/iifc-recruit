import { JobRequestList } from '@/components/app/admin/job-management/job-request-list';
import { JobRequestStatus } from '@/interfaces/job.interface';

export default function CompletedJobRequestsPage() {
	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Completed Job Requests</h1>
					<p className='text-muted-foreground'>Browse all successfully completed job requests.</p>
				</div>
			</div>
			<JobRequestList status={JobRequestStatus.COMPLETED} />
		</div>
	);
}
