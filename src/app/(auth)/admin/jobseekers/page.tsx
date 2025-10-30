
'use client';

import { JobseekerManagement } from '@/components/app/admin/jobseeker/jobseeker-management';
import { Button } from '@/components/ui/button';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminJobseekersPage() {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [organizations, setOrganizations] = useState<IClientOrganization[]>([]);

	useEffect(() => {
		MasterDataService.clientOrganization
			.getList({ body: { isClient: true } })
			.then((res) => setOrganizations(res.body));
	}, []);

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
			<JobseekerManagement
				isFormOpen={isFormOpen}
				setIsFormOpen={setIsFormOpen}
				organizations={organizations}
			/>
		</div>
	);
}
