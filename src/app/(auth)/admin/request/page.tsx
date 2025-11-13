import { JobRequestList } from '@/components/app/admin/job-management/job-request-list';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes.constant';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ManageJobRequestsPage() {
	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-center'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Job Requests</h1>
					<p className='text-muted-foreground'>Review, approve, and manage all incoming job requests.</p>
				</div>
				<Button asChild>
					<Link href={ROUTES.JOB_REQUEST.CREATE}>
						<PlusCircle className='mr-2 h-4 w-4' />
						Create New Request
					</Link>
				</Button>
			</div>
			<JobRequestList />
		</div>
	);
}
