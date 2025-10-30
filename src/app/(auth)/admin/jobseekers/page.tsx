
'use client';

import { JobseekerManagement } from '@/components/app/admin/jobseeker/jobseeker-management';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function AdminJobseekersPage() {
	const [isFormOpen, setIsFormOpen] = useState(false);

	return (
		<div className='space-y-8'>
			<div className='flex items-center justify-between'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>Jobseeker Management</h1>
					<p className='text-muted-foreground'>
						Browse, filter, and manage all jobseekers in your system.
					</p>
				</div>
				<Button onClick={() => setIsFormOpen(true)}>
					<PlusCircle className='mr-2 h-4 w-4' />
					Create Jobseeker
				</Button>
			</div>
			<JobseekerManagement isFormOpen={isFormOpen} setIsFormOpen={setIsFormOpen} />
		</div>
	);
}
