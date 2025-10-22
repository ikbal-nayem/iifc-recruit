import { RequestedPostsList } from '@/components/app/admin/application/requested-posts-list';
import { JobRequestStatus } from '@/interfaces/job.interface';

export default function ProcessingApplicationsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Processing Applications</h1>
					<p className='text-muted-foreground'>Manage all application processes that are in progress.</p>
				</div>
			</div>
			<RequestedPostsList status={JobRequestStatus.PROCESSING} />
		</div>
	);
}
