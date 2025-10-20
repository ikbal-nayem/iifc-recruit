'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RequestedPost } from '@/interfaces/job.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { Application } from '@/lib/types';
import { getStatusVariant } from '@/lib/utils';
import { ArrowLeft, Building, ChevronsRight, Loader2, Save, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ApplicantListManager } from './applicant-list-manager';
import { ApplicantsTable } from './applicants-table';
import { ExaminerSetup } from './examiner-setup';
import { Jobseeker } from '@/interfaces/jobseeker.interface';

type Applicant = Jobseeker & { application: Application };

interface ApplicationManagementPageProps {
	requestedPost: RequestedPost;
	initialExaminers: IClientOrganization[];
	initialApplicants: Applicant[];
}

export function ApplicationManagementPage({
	requestedPost,
	initialExaminers,
	initialApplicants,
}: ApplicationManagementPageProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [examiners] = useState<IClientOrganization[]>(initialExaminers);
	const [selectedExaminer, setSelectedExaminer] = useState<string | undefined>(undefined);
	const [isSaving, setIsSaving] = useState(false);
	const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);

	const applicantStats = useMemo(() => {
		return applicants.reduce(
			(acc, applicant) => {
				const status = applicant.application.status;
				acc[status] = (acc[status] || 0) + 1;
				acc.total++;
				return acc;
			},
			{
				total: 0,
				Applied: 0,
				Hired: 0,
			} as Record<Application['status'] | 'total', number>
		);
	}, [applicants]);

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

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back to Pending List
				</Button>
				<div>
					<Button onClick={handleProceed} disabled={isSaving} variant='warning' className='me-2'>
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
						<p className='text-3xl font-bold'>{applicantStats.Applied}</p>
					</CardContent>
				</Card>
				<Card className='col-span-1'>
					<CardHeader>
						<CardTitle className='text-sm text-muted-foreground'>Accepted</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold'>{applicantStats.Shortlisted}</p>
					</CardContent>
				</Card>
				<Card className='col-span-1'>
					<CardHeader>
						<CardTitle className='text-sm text-muted-foreground'>Hired</CardTitle>
					</CardHeader>
					<CardContent>
						<p className='text-3xl font-bold'>{applicantStats.Hired}</p>
					</CardContent>
				</Card>
			</div>

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
					<ApplicantsTable applicants={applicants} setApplicants={setApplicants} />
				</CardContent>
			</Card>

			<ExaminerSetup
				examiners={examiners}
				selectedExaminer={selectedExaminer}
				onExaminerChange={setSelectedExaminer}
			/>

			<div className='flex justify-center mt-6'>
				<Button onClick={handleProceed} disabled={isSaving} variant='warning' className='me-2' size='lg'>
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
