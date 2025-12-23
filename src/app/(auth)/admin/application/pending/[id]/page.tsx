import { ApplicationManagementPage } from '@/components/app/admin/application/application-management-page';
import { APPLICATION_STATUS } from '@/interfaces/application.interface';
import { ApplicationService } from '@/services/api/application.service';
import { JobRequestService } from '@/services/api/job-request.service';
import { notFound } from 'next/navigation';
import { StatusCountProps } from '../../page';

async function getData(requestedPostId: string) {
	try {
		const [postRes, statusCount] = await Promise.all([
			JobRequestService.getRequestedPostById(requestedPostId),
			ApplicationService.applicantStatusCount(requestedPostId),
		]);

		const post = postRes.body;
		const allCount = statusCount.body as StatusCountProps[];
		const desiredStatuses = [APPLICATION_STATUS.APPLIED.toString(), APPLICATION_STATUS.ACCEPTED.toString()];
		const filteredStatuses = allCount.filter((s) => desiredStatuses.includes(s.status));

		return {
			post,
			statuses: filteredStatuses,
		};
	} catch (error) {
		console.error('Failed to load application management data:', error);
		notFound();
	}
}

export default async function ManageApplicationPage({ params }: { params: { id: string } }) {
	const requestedParams = await params;

	const { post, statuses } = await getData(requestedParams.id);

	return <ApplicationManagementPage requestedPost={post} statuses={statuses} isProcessing={false} />;
}
