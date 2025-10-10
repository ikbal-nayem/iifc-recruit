
import { JobRequestForm } from '@/components/app/admin/job-management/job-request-form';
import { MasterDataService } from '@/services/api/master-data.service';

async function getMasterData() {
	try {
		const [clientOrgsRes, postsRes, zonesRes] = await Promise.allSettled([
			MasterDataService.clientOrganization.get(),
			MasterDataService.post.get(),
			MasterDataService.outsourcingZone.get(),
		]);

		const clientOrganizations = clientOrgsRes.status === 'fulfilled' ? clientOrgsRes.value.body : [];
		const posts = postsRes.status === 'fulfilled' ? postsRes.value.body : [];
		const outsourcingZones = zonesRes.status === 'fulfilled' ? zonesRes.value.body : [];

		return { clientOrganizations, posts, outsourcingZones };
	} catch (error) {
		console.error('Failed to load master data for job request form', error);
		return { clientOrganizations: [], posts: [], outsourcingZones: [] };
	}
}

export default async function CreateJobRequestPage() {
	const { clientOrganizations, posts, outsourcingZones } = await getMasterData();
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
				posts={posts}
				outsourcingZones={outsourcingZones}
			/>
		</div>
	);
}
