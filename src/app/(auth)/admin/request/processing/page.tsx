import { JobRequestList } from '@/components/app/admin/job-management/job-request-list';
import { JobRequestStatus } from '@/interfaces/job.interface';

export default function ProcessingJobRequestsPage() {
	return (
		<div className='space-y-4'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Processing Job Requests</h1>
					<p className='text-muted-foreground'>Review and manage all job requests that are being processed.</p>
				</div>
			</div>
			<JobRequestList status={JobRequestStatus.PROCESSING} />
		</div>
	);
}
