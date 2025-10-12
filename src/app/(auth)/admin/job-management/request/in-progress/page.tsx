
import { JobRequestList } from '@/components/app/admin/job-management/job-request-list';
import { JobRequestStatus } from '@/interfaces/job.interface';

export default function InProgressJobRequestsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>In Progress Job Requests</h1>
					<p className='text-muted-foreground'>Review and manage all job requests that are in progress.</p>
				</div>
			</div>
			<JobRequestList status={JobRequestStatus.IN_PROGRESS} />
		</div>
	);
}
