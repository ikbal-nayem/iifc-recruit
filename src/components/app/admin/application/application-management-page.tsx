
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { ArrowLeft, Building, Loader2, Save, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApplicantListManager } from './applicant-list-manager';
import { ExaminerSetup } from './examiner-setup';
import { ApplicantsTable } from './applicants-table';
import { applications, jobseekers } from '@/lib/data';
import { Jobseeker, Application } from '@/lib/types';

type Applicant = Jobseeker & { application: Application };


export function ApplicationManagementPage({ requestedPostId }: { requestedPostId: string }) {
	const { toast } = useToast();
	const router = useRouter();
	const [post, setPost] = useState<RequestedPost | null>(null);
	const [examiners, setExaminers] = useState<IClientOrganization[]>([]);
	const [selectedExaminer, setSelectedExaminer] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [applicants, setApplicants] = useState<Applicant[]>([]);

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [postRes, examinerRes] = await Promise.all([
				JobRequestService.getRequestedPostById(requestedPostId),
				MasterDataService.clientOrganization.getList({ body: { isExaminer: true } }),
			]);
			setPost(postRes.body);
			setExaminers(examinerRes.body);

			// Mock loading applicants for this post
			const postApplications = applications
				.filter(app => app.jobId === `j${postRes.body.postId}`) // Assuming job id matches post id format
				.map(app => {
					const jobseeker = jobseekers.find(js => js.id === app.jobseekerId);
					return jobseeker ? { ...jobseeker, application: app } : null;
				})
				.filter((a): a is Applicant => a !== null);
			setApplicants(postApplications);


		} catch (error: any) {
			toast({
				title: 'Error loading data',
				description: error.message || 'Could not load post details and examiners.',
				variant: 'danger',
			});
			router.back();
		} finally {
			setIsLoading(false);
		}
	}, [requestedPostId, toast, router]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleProceed = async () => {
		if (!selectedExaminer) {
			toast({ title: 'Examiner Required', description: 'Please select an examiner to proceed.' });
			return;
		}

		setIsSaving(true);
		try {
			// Here you would typically save the examiner and applicant list to the backend
			console.log('Selected Examiner:', selectedExaminer);
			console.log('Post to be updated', post);

			// Then update the status
			// This needs a dedicated service method
			// await JobRequestService.updateRequestedPostStatus(requestedPostId, JobRequestStatus.PROCESSING);

			toast({
				title: 'Request Processing',
				description: 'The request has been moved to the processing stage.',
				variant: 'success',
			});
			router.push('/admin/application/processing');
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to update request status.',
				variant: 'danger',
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return <Loader2 className='mx-auto h-10 w-10 animate-spin' />;
	}

	if (!post) {
		return <p>Job request not found.</p>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Pending List
				</Button>
				<Button onClick={handleProceed} disabled={isSaving}>
					{isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
					Save & Proceed
				</Button>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Manage Application: {post.post?.nameEn}</CardTitle>
					<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-1'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' />
							{post.jobRequest?.clientOrganization?.nameEn}
						</span>
						<span className='flex items-center gap-1.5'>
							<Users className='h-4 w-4' />
							{post.vacancy} Vacancies
						</span>
					</CardDescription>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Applied Candidates</CardTitle>
					<CardDescription>
						These candidates have applied for the circular post.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ApplicantsTable applicants={applicants} />
				</CardContent>
			</Card>

			<ExaminerSetup
				examiners={examiners}
				selectedExaminer={selectedExaminer}
				onExaminerChange={setSelectedExaminer}
			/>

			<ApplicantListManager />
		</div>
	);
}
