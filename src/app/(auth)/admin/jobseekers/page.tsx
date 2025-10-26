import { JobseekerManagement } from '@/components/app/admin/jobseeker/jobseeker-management';

export default function AdminJobseekersPage() {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Talent Pool</h1>
				<p className='text-muted-foreground'>
					Browse, filter, and manage all jobseekers in your system.
				</p>
			</div>
			<JobseekerManagement />
		</div>
	);
}
