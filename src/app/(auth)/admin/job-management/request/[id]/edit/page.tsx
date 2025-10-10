'use client'
import { JobRequestForm } from '@/components/app/admin/job-management/job-request-form';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { JobRequest } from '@/lib/types';
import { notFound } from 'next/navigation';

const mockRequests: JobRequest[] = [
	{
		id: 'req1',
		clientOrganization: 'Apex Solutions',
    clientOrganizationId: 1,
		title: 'Senior Backend Engineer',
		positionType: 'Permanent',
		requestDate: '2024-07-28',
		status: 'Pending',
    department: 'Engineering',
    location: 'Dhaka',
    vacancyCount: 2,
    applicationDeadline: '2024-08-20',
    description: 'Looking for a skilled backend engineer.',
    responsibilities: 'Develop APIs\nMaintain databases',
    requirements: '5+ years experience\nExpert in Node.js',
	},
	{
		id: 'req2',
		clientOrganization: 'Innovatech Ltd.',
    clientOrganizationId: 2,
		title: 'Data Entry Operator',
		positionType: 'Outsourcing',
		requestDate: '2024-07-27',
		status: 'Approved',
    applicationDeadline: '2024-08-15',
    description: 'Data entry operators needed.',
    responsibilities: 'Enter data\nVerify data',
    requirements: 'Typing speed 40wpm',
    outsourcingVacancies: [
      { serviceId: 1, zoneId: 1, vacancyCount: 10 },
      { serviceId: 2, zoneId: 2, vacancyCount: 5 },
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
