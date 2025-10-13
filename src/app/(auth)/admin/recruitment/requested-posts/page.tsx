import { RequestedPostsList } from '@/components/app/admin/recruitment/requested-posts-list';

export default function RequestedPostsPage() {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Requested Posts</h1>
				<p className='text-muted-foreground'>Manage applicants for all active job posts from requests.</p>
			</div>
			<RequestedPostsList />
		</div>
	);
}
