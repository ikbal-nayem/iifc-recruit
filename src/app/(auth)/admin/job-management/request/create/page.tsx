import { CreateJobRequestForm } from '@/components/app/admin/job-management/create-job-request-form';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

async function getMasterData() {
	try {
		const [clientOrgsRes] = await Promise.allSettled([MasterDataService.clientOrganization.get()]);

		const clientOrganizations = clientOrgsRes.status === 'fulfilled' ? clientOrgsRes.value.body : [];

		return { clientOrganizations };
	} catch (error) {
		console.error('Failed to load master data for job request form', error);
		return { clientOrganizations: [] };
	}
}

export default async function CreateJobRequestPage() {
	const { clientOrganizations } = await getMasterData();
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>New Job Request</h1>
				<p className='text-muted-foreground'>
					Fill in the details below to create a new job request for a client organization.
				</p>
			</div>
			<CreateJobRequestForm clientOrganizations={clientOrganizations} />
		</div>
	);
}
