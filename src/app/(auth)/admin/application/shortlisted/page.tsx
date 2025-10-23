
import { RequestedPostsList } from '@/components/app/admin/application/requested-posts-list';
import { JobRequestStatus } from '@/interfaces/job.interface';

export default function ShortlistedApplicationsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Shortlisted Applications</h1>
					<p className='text-muted-foreground'>Manage all shortlisted application processes.</p>
				</div>
			</div>
			<RequestedPostsList status={JobRequestStatus.SHORTLISTED} />
		</div>
	);
}
