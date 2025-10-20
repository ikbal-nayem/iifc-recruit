import { ApplicationManagementPage } from '@/components/app/admin/application/application-management-page';
import { RequestedPost } from '@/interfaces/job.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { Jobseeker, Application } from '@/lib/types';
import { applications, jobseekers } from '@/lib/data';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { notFound } from 'next/navigation';

type Applicant = Jobseeker & { application: Application };

async function getData(requestedPostId: string) {
	try {
		const [postRes, examinerRes] = await Promise.all([
			JobRequestService.getRequestedPostById(requestedPostId),
			MasterDataService.clientOrganization.getList({ body: { isExaminer: true } }),
		]);

		const post = postRes.body;
		const examiners = examinerRes.body;

		// Mock loading applicants for this post
		const postApplications = applications
			.filter((app) => app.jobId === `j${postRes.body.postId}`) // Assuming job id matches post id format
			.map((app) => {
				const jobseeker = jobseekers.find((js) => js.id === app.jobseekerId);
				return jobseeker ? { ...jobseeker, application: app } : null;
			})
			.filter((a): a is Applicant => a !== null);

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
	const { post, examiners, applicants } = await getData(params.id);

	return <ApplicationManagementPage initialPost={post} initialExaminers={examiners} initialApplicants={applicants} />;
}
