'use client'
import { JobRequestForm } from '@/components/app/admin/job-management/job-request-form';
import { MasterDataService } from '@/services/api/master-data.service';
import { JobRequest } from '@/lib/types';
import { notFound } from 'next/navigation';

const mockRequests: JobRequest[] = [
	{
		id: 'req1',
		clientOrganization: 'Apex Solutions',
    clientOrganizationId: 1,
		subject: 'Senior Backend Engineer post',
		type: 'Permanent',
		requestDate: '2024-07-28',
		status: 'Pending',
    memoNo: 'MEMO-001',
    deadline: '2024-08-20',
    description: 'Looking for a skilled backend engineer.',
		requestedPosts: [{
			postId: 1,
			vacancy: 2,
			salaryFrom: 80000,
			salaryTo: 120000,
		}]
	},
	{
		id: 'req2',
		clientOrganization: 'Innovatech Ltd.',
    clientOrganizationId: 2,
		subject: 'Urgent need for Data Entry',
		type: 'Outsourcing',
		requestDate: '2024-07-27',
		status: 'Approved',
    memoNo: 'MEMO-002',
    deadline: '2024-08-15',
    description: 'Data entry operators needed.',
    requestedPosts: [
      { postId: 2, outsourcingZoneId: 1, vacancy: 10 },
      { postId: 2, outsourcingZoneId: 2, vacancy: 5 },
    ]
	},
];


async function getJobRequest(id: string) {
    // In a real app, this would fetch from an API
    const request = mockRequests.find(req => req.id === id);
    return request;
}


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

export default async function EditJobRequestPage({ params }: { params: { id: string } }) {
	const { clientOrganizations, outsourcingServices, outsourcingZones } = await getMasterData();
  const jobRequest = await getJobRequest(params.id);

  if (!jobRequest) {
    notFound();
  }

	return (
		<div className='space-y-8'>
			<div>
				<h1 className='text-3xl font-headline font-bold'>Edit Job Request</h1>
				<p className='text-muted-foreground'>
					Modify the details below to update the job request.
				</p>
			</div>
			<JobRequestForm
        initialData={jobRequest}
				clientOrganizations={clientOrganizations}
				outsourcingServices={outsourcingServices}
				outsourcingZones={outsourcingZones}
			/>
		</div>
	);
}
