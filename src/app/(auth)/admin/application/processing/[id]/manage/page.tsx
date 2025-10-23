import { ApplicationManagementPage } from '@/components/app/admin/application/application-management-page';
import { APPLICATION_STATUS } from '@/interfaces/application.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { notFound } from 'next/navigation';

async function getData(requestedPostId: string) {
	try {
		const [postRes, statusRes] = await Promise.all([
			JobRequestService.getRequestedPostById(requestedPostId),
			MasterDataService.getEnum('application-status'),
		]);

		const post = postRes.body;
		const allStatuses = statusRes.body as EnumDTO[];

		const desiredStatuses = [
			APPLICATION_STATUS.APPLIED.toString(),
			APPLICATION_STATUS.HIRED.toString(),
			APPLICATION_STATUS.ACCEPTED.toString(),
		];
		const filteredStatuses = allStatuses.filter((s) => desiredStatuses.includes(s.value));

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

	return <ApplicationManagementPage requestedPost={post} statuses={statuses} />;
}
