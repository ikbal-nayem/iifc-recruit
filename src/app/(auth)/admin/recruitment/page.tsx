
import { RequestedPostsList } from '@/components/app/admin/recruitment/requested-posts-list';

export default function RequestedPostsPage() {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Manage Applications</h1>
				<p className='text-muted-foreground'>
					Select a post to view and manage its applicants.
				</p>
			</div>
			<RequestedPostsList />
		</div>
	);
}
