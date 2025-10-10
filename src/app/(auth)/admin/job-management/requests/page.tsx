import { JobRequestList } from '@/components/app/admin/job-management/job-request-list';

export default function ManageJobRequestsPage() {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Manage Job Requests</h1>
				<p className='text-muted-foreground'>Review, approve, and manage all incoming job requests.</p>
			</div>
			<JobRequestList />
		</div>
	);
}
