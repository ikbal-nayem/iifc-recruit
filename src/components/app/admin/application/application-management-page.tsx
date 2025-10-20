
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RequestedPost } from '@/interfaces/job.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { ArrowLeft, Building, Loader2, Save, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ApplicantListManager } from './applicant-list-manager';
import { ExaminerSetup } from './examiner-setup';
import { ApplicantsTable } from './applicants-table';
import { Jobseeker, Application } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '@/lib/utils';
import { JobRequestService } from '@/services/api/job-request.service';

type Applicant = Jobseeker & { application: Application };

interface ApplicationManagementPageProps {
	initialPost: RequestedPost;
	initialExaminers: IClientOrganization[];
	initialApplicants: Applicant[];
}

export function ApplicationManagementPage({
	initialPost,
	initialExaminers,
	initialApplicants,
}: ApplicationManagementPageProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [post, setPost] = useState<RequestedPost>(initialPost);
	const [examiners] = useState<IClientOrganization[]>(initialExaminers);
	const [selectedExaminer, setSelectedExaminer] = useState<string | undefined>(undefined);
	const [isSaving, setIsSaving] = useState(false);
	const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);

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
					<div className='flex items-center gap-4'>
						<CardTitle>{post.post?.nameEn}</CardTitle>
						{post.statusDTO?.nameEn && <Badge variant={getStatusVariant(post.status)}>{post.statusDTO.nameEn}</Badge>}
					</div>
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
				<CardHeader className='flex-row items-center justify-between'>
					<div>
						<CardTitle>Applied Candidates</CardTitle>
						<CardDescription>These candidates have applied for the circular post.</CardDescription>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant='outline'>
								<UserPlus className='mr-2 h-4 w-4' />
								Add Candidate
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-3xl'>
							<DialogHeader>
								<DialogTitle>Add Applicants to Primary List</DialogTitle>
							</DialogHeader>
							<div className='max-h-[70vh] overflow-y-auto p-1'>
								<ApplicantListManager />
							</div>
						</DialogContent>
					</Dialog>
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

			<div className='flex justify-center mt-6'>
				<Button onClick={handleProceed} disabled={isSaving} size='lg'>
					{isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
					Save & Proceed
				</Button>
			</div>
		</div>
	);
}
