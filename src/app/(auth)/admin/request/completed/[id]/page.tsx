import { JobRequestDetails } from '@/components/app/admin/job-management/job-request-details';
import { JobRequest } from '@/interfaces/job.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { notFound } from 'next/navigation';

async function getJobRequest(id: string): Promise<JobRequest> {
	try {
		const response = await JobRequestService.getById(id);
		return response.body;
	} catch (error) {
		console.error('Failed to load job request:', error);
		notFound();
	}
}

export default async function JobRequestCompletedDetailsPage({ params }: { params: { id: string } }) {
	const reqParams = await params;
	const jobRequest = await getJobRequest(reqParams.id);

	return (
		<div className='space-y-8'>
			<JobRequestDetails initialJobRequest={jobRequest} />
		</div>
	);
}
