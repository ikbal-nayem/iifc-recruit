import { ApplicantManagement } from '@/components/app/admin/recruitment/applicant-management';
import { RequestedPost } from '@/interfaces/job.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { notFound } from 'next/navigation';

// This is a mock function. In a real app, you would fetch this from your API.
async function getRequestedPost(id: string): Promise<RequestedPost | null> {
	// try {
	// 	const response = await JobRequestService.getRequestedPostById(id);
	// 	return response.body;
	// } catch (error) {
	// 	console.error('Failed to load requested post:', error);
	// 	notFound();
	// }
	// Mocking data for now
	const mockPost: RequestedPost = {
		id: parseInt(id),
		postId: 1,
		post: {
			id: 1,
			nameEn: 'Driver',
			nameBn: 'ড্রাইভার',
			active: true,
		},
		vacancy: 5,
		experienceRequired: 2,
		status: 'PROCESSING',
	};
	return mockPost;
}

export default async function ManageApplicantsPage({ params }: { params: { id: string } }) {
	const post = await getRequestedPost(params.id);

	if (!post) {
		notFound();
	}

	return <ApplicantManagement post={post} />;
}
