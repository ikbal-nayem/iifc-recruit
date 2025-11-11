import { RequestedPostsList } from '@/components/app/admin/application/requested-posts-list';
import { JobRequestedPostStatus } from '@/interfaces/job.interface';

export default function PendingApplicationsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Pending Applications</h1>
					<p className='text-muted-foreground'>Review and prepare all incoming job posts for processing.</p>
				</div>
			</div>
			<RequestedPostsList status={JobRequestedPostStatus.PENDING} />
		</div>
	);
}
