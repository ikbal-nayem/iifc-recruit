import { JobRequestForm } from '@/components/app/admin/job-management/job-request-form';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

async function getMasterData() {
	try {
		const [clientOrgsRes, servicesRes, zonesRes] = await Promise.allSettled([
			MasterDataService.clientOrganization.get(),
			MasterDataService.outsourcingService.get(),
			MasterDataService.outsourcingZone.get(),
		]);

		const clientOrganizations = clientOrgsRes.status === 'fulfilled' ? clientOrgsRes.value.body : [];
		const outsourcingServices = servicesRes.status === 'fulfilled' ? servicesRes.value.body : [];
		const outsourcingZones = zonesRes.status === 'fulfilled' ? zonesRes.value.body : [];

		return { clientOrganizations, outsourcingServices, outsourcingZones };
	} catch (error) {
		console.error('Failed to load master data for job request form', error);
		return { clientOrganizations: [], outsourcingServices: [], outsourcingZones: [] };
	}
}

export default async function CreateJobRequestPage() {
	const { clientOrganizations, outsourcingServices, outsourcingZones } = await getMasterData();
	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>New Job Request</h1>
				<p className='text-muted-foreground'>
					Fill in the details below to create a new job request for a client organization.
				</p>
			</div>
			<JobRequestForm
				clientOrganizations={clientOrganizations}
				outsourcingServices={outsourcingServices}
				outsourcingZones={outsourcingZones}
			/>
		</div>
	);
}
