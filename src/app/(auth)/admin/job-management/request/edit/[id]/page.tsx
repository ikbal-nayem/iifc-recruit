
'use client';
import { JobRequestForm } from '@/components/app/admin/job-management/job-request-form';
import { MasterDataService } from '@/services/api/master-data.service';
import { notFound } from 'next/navigation';
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from '@/interfaces/master-data.interface';
import { useEffect, useState } from 'react';
import { JobRequest } from '@/interfaces/job.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { PageLoader } from '@/components/ui/page-loader';


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
             try {
                const response = await JobRequestService.getById(id);
                setJobRequest(response.body);
            } catch (error) {
                console.error('Failed to load job request:', error);
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
        return <PageLoader />;
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
