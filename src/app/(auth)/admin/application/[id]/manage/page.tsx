import { ApplicationManagementPage } from '@/components/app/admin/application/application-management-page';
import { applications, jobseekers } from '@/lib/data';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { notFound } from 'next/navigation';


async function getData(requestedPostId: string) {
	try {
		const [postRes, examinerRes] = await Promise.all([
			JobRequestService.getRequestedPostById(requestedPostId),
			MasterDataService.clientOrganization.getList({ body: { isExaminer: true } }),
		]);

		const post = postRes.body;
		const examiners = examinerRes.body;

		const postApplications = applications
			.filter((app) => app.jobId === `j${postRes.body.postId}`)
			.map((app) => {
				const jobseeker = jobseekers.find((js) => js.id === app.jobseekerId);
				return jobseeker ? { ...jobseeker, application: app } : null;
			})
			.filter((a) => a !== null);

		return {
			post,
			examiners,
			applicants: postApplications,
		};
	} catch (error) {
		console.error('Failed to load application management data:', error);
		notFound();
	}
}

export default async function ManageApplicationPage({ params }: { params: { id: string } }) {
	const requestedParams = await params;

	const { post, examiners, applicants } = await getData(requestedParams.id);

	return (
		<ApplicationManagementPage
			requestedPost={post}
			initialExaminers={examiners}
			initialApplicants={applicants}
		/>
	);
}
