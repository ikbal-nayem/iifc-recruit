
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { RequestedPost } from '@/interfaces/job.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { EnumDTO, IClientOrganization } from '@/interfaces/master-data.interface';
import { getStatusVariant } from '@/lib/utils';
import { ApplicationService } from '@/services/api/application.service';
import { ArrowLeft, Building, ChevronsRight, Loader2, Save, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ApplicantListManager } from './applicant-list-manager';
import { ApplicantsTable } from './applicants-table';
import { ExaminerSetup } from './examiner-setup';

interface ApplicationManagementPageProps {
	requestedPost: RequestedPost;
	initialExaminers: IClientOrganization[];
	statuses: EnumDTO[];
}

export function ApplicationManagementPage({
	requestedPost,
	initialExaminers,
	statuses,
}: ApplicationManagementPageProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [examiners] = useState<IClientOrganization[]>(initialExaminers);
	const [selectedExaminer, setSelectedExaminer] = useState<string | undefined>(undefined);
	const [isSaving, setIsSaving] = useState(false);
	const [applicants, setApplicants] = useState<Application[]>([]);
	const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);
	const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);

	const applicantStats = useMemo(() => {
		return applicants.reduce(
			(acc, applicant) => {
				const status = applicant.status;
				acc[status] = (acc[status] || 0) + 1;
				acc.total++;
				return acc;
			},
			{
				total: 0,
				[APPLICATION_STATUS.APPLIED]: 0,
				[APPLICATION_STATUS.HIRED]: 0,
				[APPLICATION_STATUS.ACCEPTED]: 0,
			} as Record<Application['status'] | 'total', number>
		);
	}, [applicants]);

	const loadApplicants = useCallback(async () => {
		setIsLoadingApplicants(true);
		try {
			const response = await ApplicationService.getList({
				body: { requestedPostId: requestedPost.id },
				meta: { limit: 1000 }, // Assuming we want all applicants for this view
			});
			setApplicants(response.body);
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to load applicants.',
				variant: 'danger',
			});
		} finally {
			setIsLoadingApplicants(false);
		}
	}, [requestedPost.id, toast]);

	useEffect(() => {
		loadApplicants();
	}, [loadApplicants]);

	const handleProceed = async () => {
		if (!selectedExaminer) {
			toast({ title: 'Examiner Required', description: 'Please select an examiner to proceed.' });
			return;
		}

		setIsSaving(true);
		try {
			console.log('Selected Examiner:', selectedExaminer);
			console.log('Post to be updated', requestedPost);

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

	const handleApplyApplicants = (newApplicants: JobseekerSearch[]) => {
		const payload = newApplicants.map((js) => ({
			applicantId: js.userId,
			requestedPostId: requestedPost.id!,
			status: APPLICATION_STATUS.APPLIED,
		}));

		ApplicationService.createAll(payload)
			.then((res) => {
				toast({
					title: 'Candidates Applied',
					description: `${newApplicants.length} candidate(s) have been added to the application list.`,
					variant: 'success',
				});
				setIsAddCandidateOpen(false);
				loadApplicants();
			})
			.catch((err) => {
				toast({
					title: 'Failed to Add Candidates',
					description: err.message,
					variant: 'danger',
				});
			});
	};

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Pending List
				</Button>
				<div>
					<Button onClick={handleProceed} disabled={isSaving} variant='lite-success' className='me-2'>
						{isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
						Save
					</Button>
					<Button onClick={handleProceed} disabled={isSaving}>
						{isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
						Save & Proceed
					</Button>
				</div>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<div className='flex items-center gap-4'>
						<CardTitle>{requestedPost?.post?.nameEn}</CardTitle>
						{requestedPost.statusDTO?.nameEn && (
							<Badge variant={getStatusVariant(requestedPost.status)}>{requestedPost.statusDTO.nameEn}</Badge>
						)}
					</div>
					<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-1'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' />
							{requestedPost.jobRequest?.clientOrganization?.nameEn}
						</span>
						<span className='flex items-center gap-1.5'>
							<Users className='h-4 w-4' />
							{requestedPost.vacancy} Vacancies
						</span>
					</CardDescription>
				</CardHeader>
			</Card>

			<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4'>
				<Card className='col-span-1'>
					<CardHeader>
						<CardTitle className='text-sm text-muted-foreground'>Total Applicants</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold'>{applicantStats.total}</p>
					</CardContent>
				</Card>
				<Card className='col-span-1'>
					<CardHeader>
						<CardTitle className='text-sm text-muted-foreground'>Applied</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold'>{applicantStats.APPLIED}</p>
					</CardContent>
				</Card>
				<Card className='col-span-1'>
					<CardHeader>
						<CardTitle className='text-sm text-muted-foreground'>Accepted</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold'>{applicantStats.ACCEPTED}</p>
					</CardContent>
				</Card>
				<Card className='col-span-1'>
					<CardHeader>
						<CardTitle className='text-sm text-muted-foreground'>Hired</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold'>{applicantStats.HIRED}</p>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className='flex-row items-center justify-between'>
					<div>
						<CardTitle>Applied Candidates</CardTitle>
						<CardDescription>These candidates have applied for the circular post.</CardDescription>
					</div>
					<Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
						<DialogTrigger asChild>
							<Button variant='outline'>
								<UserPlus className='mr-2 h-4 w-4' />
								Add Candidate
							</Button>
						</DialogTrigger>
						<DialogContent className='max-w-4xl h-[90vh] flex flex-col p-0'>
							<DialogHeader className='p-6 pb-0'>
								<DialogTitle>Add Applicants to Primary List</DialogTitle>
							</DialogHeader>
							<div className='flex-1 overflow-y-auto px-6'>
								<ApplicantListManager
									onApply={handleApplyApplicants}
									existingApplicantIds={applicants.map((a) => a.applicantId)}
								/>
							</div>
						</DialogContent>
					</Dialog>
				</CardHeader>
				<CardContent>
					<ApplicantsTable
						applicants={applicants}
						setApplicants={setApplicants}
						statuses={statuses}
						isLoading={isLoadingApplicants}
					/>
				</CardContent>
			</Card>

			<ExaminerSetup
				examiners={examiners}
				selectedExaminer={selectedExaminer}
				onExaminerChange={setSelectedExaminer}
			/>

			<div className='flex justify-center mt-6'>
				<Button onClick={handleProceed} disabled={isSaving} variant='lite-success' className='me-2' size='lg'>
					{isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
					Save
				</Button>
				<Button onClick={handleProceed} disabled={isSaving} size='lg'>
					{isSaving ? (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					) : (
						<ChevronsRight className='mr-2 h-4 w-4' />
					)}
					Save & Proceed to Next Stage
				</Button>
			</div>
		</div>
	);
}
