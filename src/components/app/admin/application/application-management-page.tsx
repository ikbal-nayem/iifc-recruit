
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { ROUTES } from '@/constants/routes.constant';
import { useToast } from '@/hooks/use-toast';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobRequestedPostStatus, RequestedPost } from '@/interfaces/job.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { cn, getStatusVariant } from '@/lib/utils';
import { ApplicationService } from '@/services/api/application.service';
import { JobRequestService } from '@/services/api/job-request.service';
import { getExaminerAsync } from '@/services/async-api';
import { ArrowLeft, Building, ChevronsRight, Edit, Loader2, UserCheck, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApplicantListManager } from './applicant-list-manager';
import { ApplicantsTable } from './applicants-table';

interface ApplicationManagementPageProps {
	requestedPost: RequestedPost;
	statuses: EnumDTO[];
}

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

export function ApplicationManagementPage({
	requestedPost: initialPost,
	statuses,
}: ApplicationManagementPageProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [requestedPost, setRequestedPost] = useState<RequestedPost>(initialPost);
	const [isProceeding, setIsProceeding] = useState(false);
	const [applicants, setApplicants] = useState<Application[]>([]);
	const [applicantsMeta, setApplicantsMeta] = useState<IMeta>(initMeta);
	const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);
	const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string | null>(null);
	const [isProceedConfirmationOpen, setIsProceedConfirmationOpen] = useState(false);

	const [isExaminerDialogOpen, setIsExaminerDialogOpen] = useState(false);
	const [isSavingExaminer, setIsSavingExaminer] = useState(false);
	const [selectedExaminerId, setSelectedExaminerId] = useState<string | undefined>(
		initialPost.examinerId?.toString()
	);

	const examinerForm = useForm();

	const applicantStats = useMemo(() => {
		const stats = statuses.reduce(
			(acc, status) => {
				acc[status.value] = 0;
				return acc;
			},
			{} as Record<string, number>
		);
		stats.total = 0;

		applicants.forEach((applicant) => {
			if (stats.hasOwnProperty(applicant.status)) {
				stats[applicant.status]++;
			}
			stats.total++;
		});
		return stats;
	}, [applicants, statuses]);

	const loadApplicants = useCallback(
		async (page: number, status?: string | null) => {
			setIsLoadingApplicants(true);
			try {
				const payload: IApiRequest = {
					body: { requestedPostId: requestedPost.id, ...(status && { status: status }) },
					meta: { page, limit: applicantsMeta.limit },
				};
				const response = await ApplicationService.getList(payload);
				setApplicants(response.body);
				setApplicantsMeta(response.meta);
			} catch (error: any) {
				toast({
					description: error.message || 'Failed to load applicants.',
					variant: 'danger',
				});
			} finally {
				setIsLoadingApplicants(false);
			}
		},
		[requestedPost.id, toast, applicantsMeta.limit]
	);

	useEffect(() => {
		loadApplicants(0, statusFilter);
	}, [statusFilter, loadApplicants]);

	const handleApplyApplicants = (newApplicants: JobseekerSearch[], onSuccess?: () => void) => {
		const payload = newApplicants.map((js) => ({
			applicantId: js.userId,
			requestedPostId: requestedPost.id,
			status: APPLICATION_STATUS.APPLIED,
		}));

		ApplicationService.createAll(payload)
			.then((res) => {
				toast({
					title: 'Candidates Applied',
					description: `${newApplicants.length} candidate(s) have been added to the application list.`,
					variant: 'success',
				});
				onSuccess && onSuccess();
				loadApplicants(0);
			})
			.catch((err) => {
				toast({
					description: err.message,
					variant: 'danger',
				});
			});
	};

	const handleUpdateApplication = async (updatedApplicants: Application[]) => {
		try {
			const resp = await ApplicationService.updateAll(updatedApplicants);
			toast({
				title: 'Application Updated',
				description: resp?.message,
				variant: 'success',
			});
			loadApplicants(applicantsMeta.page);
			return resp;
		} catch (error: any) {
			toast({
				description: error.message || 'Failed to update application.',
				variant: 'danger',
			});
		}
	};

	const handlePageChange = (newPage: number) => {
		loadApplicants(newPage, statusFilter);
	};

	const handleSaveExaminer = async () => {
		if (!selectedExaminerId) {
			toast({ title: 'Error', description: 'No examiner selected.', variant: 'danger' });
			return;
		}
		setIsSavingExaminer(true);
		try {
			const response = await JobRequestService.getRequestedPostUpdate({
				...requestedPost,
				examinerId: selectedExaminerId,
			});
			const updatedPost = response.body;
			setRequestedPost(updatedPost);
			toast({
				title: 'Examiner Assigned',
				description: 'The examining organization has been assigned to this post.',
				variant: 'success',
			});
			setIsExaminerDialogOpen(false);
		} catch (error: any) {
			toast({
				description: error.message || 'Failed to assign examiner.',
				variant: 'danger',
			});
		} finally {
			setIsSavingExaminer(false);
		}
	};

	const handleProceed = async () => {
		if (!requestedPost.examinerId) {
			toast({
				title: 'Examiner Required',
				description: 'Please assign an examiner before proceeding.',
				variant: 'warning',
			});
			setIsProceedConfirmationOpen(false);
			setIsExaminerDialogOpen(true);
			return;
		}

		setIsProceeding(true);
		try {
			await JobRequestService.proceedToProcess(requestedPost.id as string);
			toast({
				title: 'Request Processing',
				description: 'The request has been moved to the processing stage.',
				variant: 'success',
			});
			router.push(ROUTES.APPLICATION_PROCESSING);
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to proceed to the next stage.',
				variant: 'danger',
			});
		} finally {
			setIsProceeding(false);
			setIsProceedConfirmationOpen(false);
		}
	};

	const mainStatItems = statuses
		.filter((s) => s.value !== APPLICATION_STATUS.HIRED)
		.map((status) => ({
			label: status.nameEn,
			value: applicantStats[status.value] || 0,
			status: status.value,
		}));

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back
				</Button>
				<Button onClick={() => setIsProceedConfirmationOpen(true)} size='lg'>
					<ChevronsRight className='mr-2 h-4 w-4' />
					Proceed to Next Stage
				</Button>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<div className='flex items-center gap-4'>
						<CardTitle>{requestedPost?.post?.nameEn}</CardTitle>
						{requestedPost.statusDTO?.nameEn && (
							<Badge variant={getStatusVariant(requestedPost.status)}>{requestedPost.statusDTO.nameEn}</Badge>
						)}
					</div>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
						<CardDescription className='flex flex-wrap items-center gap-x-4'>
							<span className='flex items-center gap-1.5'>
								<Building className='h-4 w-4' />
								{requestedPost.jobRequest?.clientOrganization?.nameEn}
							</span>
							<span className='flex items-center gap-1.5'>
								<Users className='h-4 w-4' />
								{requestedPost.vacancy} Vacancies
							</span>
						</CardDescription>
						<div className='flex items-center gap-2 text-sm'>
							<span className='text-muted-foreground'>Examiner:</span>
							<span className='font-semibold'>{requestedPost.examiner?.nameEn || 'Not Assigned'}</span>
							<Button
								variant='ghost'
								size='icon'
								className='h-7 w-7'
								onClick={() => setIsExaminerDialogOpen(true)}
							>
								<Edit className='h-4 w-4 text-primary' />
							</Button>
						</div>
					</div>
				</CardHeader>
			</Card>
			<Card className='glassmorphism p-4'>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 text-center'>
					<div
						className={cn(
							'p-4 rounded-lg cursor-pointer transition-all hover:bg-muted',
							statusFilter === null && 'bg-primary/10 ring-2 ring-primary'
						)}
						onClick={() => setStatusFilter(null)}
					>
						<p className='text-3xl font-bold'>{applicantStats.total || 0}</p>
						<p className='text-sm text-muted-foreground'>Total Applicants</p>
					</div>

					{mainStatItems.map((item) => (
						<div
							key={item.label}
							onClick={() => setStatusFilter(item.status)}
							className={cn(
								'p-4 rounded-lg cursor-pointer transition-all hover:bg-muted',
								statusFilter === item.status && 'bg-primary/10 ring-2 ring-primary'
							)}
						>
							<p className='text-3xl font-bold'>{item.value}</p>
							<p className='text-sm text-muted-foreground'>{item.label}</p>
						</div>
					))}
				</div>
			</Card>
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
						isLoading={isLoadingApplicants}
						meta={applicantsMeta}
						onPageChange={handlePageChange}
						updateApplication={handleUpdateApplication}
						requestedPostStatus={requestedPost.status}
					/>
				</CardContent>
			</Card>

			<div className='flex justify-center mt-6'>
				<Button onClick={() => setIsProceedConfirmationOpen(true)} size='lg'>
					<ChevronsRight className='mr-2 h-4 w-4' />
					Proceed to Next Stage
				</Button>
			</div>

			<Dialog open={isProceedConfirmationOpen} onOpenChange={setIsProceedConfirmationOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Proceed to Next Stage?</DialogTitle>
						<DialogDescription>
							You are about to move the selected applicants to the next stage of the recruitment process.
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-4 py-4'>
						<div className='rounded-md border p-4 text-sm'>
							<p className='text-muted-foreground'>Assigned Examiner</p>
							<p className='font-semibold'>{requestedPost.examiner?.nameEn || 'Not Assigned'}</p>
						</div>
						<Alert variant='warning'>
							<AlertTitle>Important</AlertTitle>
							<AlertDescription>
								Only applicants with the &quot;Accepted&quot; status will be moved to the next stage.
							</AlertDescription>
						</Alert>
					</div>
					<DialogFooter>
						<Button variant='ghost' onClick={() => setIsProceedConfirmationOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleProceed} disabled={isProceeding}>
							{isProceeding ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
							Confirm & Proceed
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Assign examiner */}
			<Dialog open={isExaminerDialogOpen} onOpenChange={setIsExaminerDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Assign Examiner</DialogTitle>
						<DialogDescription>
							Select an examiner for the post: &quot;{requestedPost.post?.nameEn}&quot;.
						</DialogDescription>
					</DialogHeader>
					<div className='py-4'>
						<Form {...examinerForm}>
							<FormAutocomplete
								control={examinerForm.control}
								name='examinerId'
								label='Examiner'
								placeholder='Search for an examining organization...'
								required
								loadOptions={getExaminerAsync}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
								value={selectedExaminerId}
								initialLabel={requestedPost.examiner?.nameEn}
								onValueChange={setSelectedExaminerId}
							/>
						</Form>
					</div>
					<DialogFooter>
						<Button variant='ghost' onClick={() => setIsExaminerDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveExaminer} disabled={isSavingExaminer}>
							{isSavingExaminer && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
