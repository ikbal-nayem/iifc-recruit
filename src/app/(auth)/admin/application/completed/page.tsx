import { RequestedPostsList } from '@/components/app/admin/application/requested-posts-list';
import { JobRequestStatus } from '@/interfaces/job.interface';

export default function CompletedApplicationsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Completed Applications</h1>
					<p className='text-muted-foreground'>Browse all successfully completed application processes.</p>
				</div>
			</div>
			<RequestedPostsList status={JobRequestStatus.COMPLETED} />
		</div>
	);
}
