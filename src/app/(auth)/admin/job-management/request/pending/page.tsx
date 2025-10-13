import { JobRequestList } from '@/components/app/admin/recruitment/job-request-list';
import { JobRequestStatus } from '@/interfaces/job.interface';

export default function PendingJobRequestsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Pending Job Requests</h1>
					<p className='text-muted-foreground'>Review and process all incoming job requests.</p>
				</div>
			</div>
			<JobRequestList status={JobRequestStatus.PENDING} />
		</div>
	);
}
