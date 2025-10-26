import { JobRequestForm } from '@/components/app/admin/job-management/job-request-form';
import { JobRequest } from '@/interfaces/job.interface';
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from '@/interfaces/master-data.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { notFound } from 'next/navigation';

type MasterData = {
	clientOrganizations: IClientOrganization[];
	posts: IPost[];
	outsourcingZones: IOutsourcingZone[];
	requestTypes: EnumDTO[];
};

async function getJobRequest(id: string): Promise<JobRequest> {
	try {
		const response = await JobRequestService.getById(id);
		return response.body;
	} catch (error) {
		console.error('Failed to load job request:', error);
		notFound();
	}
}

async function getMasterData(): Promise<MasterData> {
	try {
		const [clientOrgsRes, postsRes, zonesRes, requestTypesRes] = await Promise.allSettled([
			MasterDataService.clientOrganization.getList({body: { isClient: true }}),
			MasterDataService.post.getList({}),
			MasterDataService.outsourcingZone.get(),
			MasterDataService.getEnum('job-request-type'),
		]);

		const clientOrganizations = clientOrgsRes.status === 'fulfilled' ? clientOrgsRes.value.body : [];
		const posts = postsRes.status === 'fulfilled' ? postsRes.value.body : [];
		const outsourcingZones = zonesRes.status === 'fulfilled' ? zonesRes.value.body : [];
		const requestTypes =
			requestTypesRes.status === 'fulfilled' ? (requestTypesRes.value.body as EnumDTO[]) : [];

		return { clientOrganizations, posts, outsourcingZones, requestTypes };
	} catch (error) {
		console.error('Failed to load master data for job request form', error);
		return { clientOrganizations: [], posts: [], outsourcingZones: [], requestTypes: [] };
	}
}

export default async function EditJobRequestPage({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
	const [jobRequest, masterData] = await Promise.all([getJobRequest(resolvedParams.id), getMasterData()]);

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Edit Job Request</h1>
				<p className='text-muted-foreground'>Modify the details below to update the job request.</p>
			</div>
			<JobRequestForm
				initialData={jobRequest}
				clientOrganizations={masterData.clientOrganizations}
				posts={masterData.posts}
				outsourcingZones={masterData.outsourcingZones}
				requestTypes={masterData.requestTypes}
			/>
		</div>
	);
}
