import { JobseekerManagement } from '@/components/app/admin/jobseeker-management';

export default function AdminJobseekersPage() {
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Jobseeker Management</h1>
				<p className='text-muted-foreground'>
					Browse, filter, and manage all jobseekers in your talent pool.
				</p>
			</div>
			<JobseekerManagement />
		</div>
	);
}
