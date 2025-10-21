import { ApplicationManagementPage } from '@/components/app/admin/application/application-management-page';
import { IClientOrganization, EnumDTO } from '@/interfaces/master-data.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { notFound } from 'next/navigation';

async function getData(requestedPostId: string) {
	try {
		const [postRes, examinerRes, statusRes] = await Promise.all([
			JobRequestService.getRequestedPostById(requestedPostId),
			MasterDataService.clientOrganization.getList({ body: { isExaminer: true } }),
			MasterDataService.getEnum('application-status'),
		]);

		const post = postRes.body;
		const examiners = examinerRes.body;
		const allStatuses = statusRes.body as EnumDTO[];

		const desiredStatuses = ['APPLIED', 'HIRED', 'ACCEPTED'];
		const filteredStatuses = allStatuses.filter((s) => desiredStatuses.includes(s.value));

		// Mocked applicants as the service isn't available
		const postApplicants = [
			/* mock data */
		];

		return {
			post,
			examiners,
			applicants: postApplicants,
			statuses: filteredStatuses,
		};
	} catch (error) {
		console.error('Failed to load application management data:', error);
		notFound();
	}
}

export default async function ManageApplicationPage({ params }: { params: { id: string } }) {
	const requestedParams = await params;

	const { post, examiners, applicants, statuses } = await getData(requestedParams.id);

	return (
		<ApplicationManagementPage
			requestedPost={post}
			initialExaminers={examiners}
			initialApplicants={applicants}
			statuses={statuses}
		/>
	);
}
