
'use client';
import { JobRequestForm } from '@/components/app/admin/job-management/job-request-form';
import { MasterDataService } from '@/services/api/master-data.service';
import { notFound } from 'next/navigation';
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from '@/interfaces/master-data.interface';
import { useEffect, useState } from 'react';
import { JobRequest } from '@/interfaces/job.interface';

const mockRequests: JobRequest[] = [
	{
		id: 'req1',
		clientOrganizationId: 1,
		subject: 'Senior Backend Engineer post',
		requestType: 'PERMANENT',
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
			status: 'PENDING',
		}]
	},
	{
		id: 'req2',
    clientOrganizationId: 2,
		subject: 'Urgent need for Data Entry',
		requestType: 'OUTSOURCING',
		requestDate: '2024-07-27',
		status: 'IN_PROGRESS',
    memoNo: 'MEMO-002',
    deadline: '2024-08-15',
    description: 'Data entry operators needed.',
    requestedPosts: [
      { postId: 2, outsourcingZoneId: 1, vacancy: 10, status: 'EXAM' },
      { postId: 2, outsourcingZoneId: 2, vacancy: 5, status: 'PENDING' },
    ]
	},
];


type MasterData = {
    clientOrganizations: IClientOrganization[];
    posts: IPost[];
    outsourcingZones: IOutsourcingZone[];
    requestTypes: EnumDTO[];
}


export default function EditJobRequestPage({ params }: { params: { id: string } }) {
    const [jobRequest, setJobRequest] = useState<JobRequest | null>(null);
    const [masterData, setMasterData] = useState<MasterData | null>(null);

    useEffect(() => {
        async function getJobRequest(id: string) {
            // In a real app, this would fetch from an API
            const request = mockRequests.find(req => req.id === id) || null;
            setJobRequest(request);
            if (!request) {
                notFound();
            }
        }

        async function getMasterData() {
            try {
                const [clientOrgsRes, postsRes, zonesRes, requestTypesRes] = await Promise.allSettled([
                    MasterDataService.clientOrganization.get(),
                    MasterDataService.post.get(),
                    MasterDataService.outsourcingZone.get(),
                    MasterDataService.getEnum('job-request-type'),
                ]);

                const clientOrganizations = clientOrgsRes.status === 'fulfilled' ? clientOrgsRes.value.body : [];
                const posts = postsRes.status === 'fulfilled' ? postsRes.value.body : [];
                const outsourcingZones = zonesRes.status === 'fulfilled' ? zonesRes.value.body : [];
                const requestTypes = requestTypesRes.status === 'fulfilled' ? requestTypesRes.value.body as EnumDTO[] : [];
                
                setMasterData({ clientOrganizations, posts, outsourcingZones, requestTypes });
            } catch (error) {
                console.error('Failed to load master data for job request form', error);
                setMasterData({ clientOrganizations: [], posts: [], outsourcingZones: [], requestTypes: [] });
            }
        }

        getJobRequest(params.id);
        getMasterData();
    }, [params.id]);

    if (!jobRequest || !masterData) {
        return <div>Loading...</div>; // Or a proper skeleton loader
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
				clientOrganizations={masterData.clientOrganizations}
				posts={masterData.posts}
				outsourcingZones={masterData.outsourcingZones}
        requestTypes={masterData.requestTypes}
			/>
		</div>
	);
}
