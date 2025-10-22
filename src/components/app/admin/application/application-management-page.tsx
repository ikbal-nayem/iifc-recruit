'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useToast } from '@/hooks/use-toast';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobRequestedPostStatus, RequestedPost } from '@/interfaces/job.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { EnumDTO, IClientOrganization } from '@/interfaces/master-data.interface';
import { cn, getStatusVariant } from '@/lib/utils';
import { ApplicationService } from '@/services/api/application.service';
import { JobRequestService } from '@/services/api/job-request.service';
import { ArrowLeft, Building, ChevronsRight, Edit, Loader2, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ApplicantListManager } from './applicant-list-manager';
import { ApplicantsTable } from './applicants-table';

interface ApplicationManagementPageProps {
	requestedPost: RequestedPost;
	examiners: IClientOrganization[];
	statuses: EnumDTO[];
}

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

export function ApplicationManagementPage({
	requestedPost,
	examiners,
	statuses,
}: ApplicationManagementPageProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [isProceeding, setIsProceeding] = useState(false);
	const [applicants, setApplicants] = useState<Application[]>([]);
	const [applicantsMeta, setApplicantsMeta] = useState<IMeta>(initMeta);
	const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);
	const [isAddCandidateOpen, setIsAddCandidateOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string | null>(null);
	const [isProceedConfirmationOpen, setIsProceedConfirmationOpen] = useState(false);
	const [proceedExaminerId, setProceedExaminerId] = useState<number | undefined>(requestedPost.examinerId);

	const [isSavingExaminer, setIsSavingExaminer] = useState<number | null>(null);
	const [selectedPostForExaminer, setSelectedPostForExaminer] = useState<RequestedPost | null>(null);
	const [selectedExaminerId, setSelectedExaminerId] = useState<string>();

	const form = useForm();

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
				[APPLICATION_STATUS.ACCEPTED]: 0,
			} as Record<Application['status'] | 'total', number>
		);
	}, [applicants]);

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

	const handleProceed = async () => {
		setIsProceeding(true);
		try {
			// Step 1: Save examiner if one is selected in the dialog
			if (proceedExaminerId) {
				await JobRequestService.setExaminer({
					requestedPostId: requestedPost.id!,
					examinerId: proceedExaminerId,
				});
				toast({
					title: 'Examiner Assigned',
					description: 'The examining organization has been assigned to this post.',
					variant: 'success',
				});
			}

			// Step 2: Proceed with the logic to move to the next stage
			console.log('Proceeding with examiner:', proceedExaminerId);
			toast({
				title: 'Request Processing',
				description: 'The request has been moved to the processing stage.',
				variant: 'success',
			});
			router.push('/admin/application/processing');
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

	const handleApplyApplicants = (newApplicants: JobseekerSearch[], onSuccess?: () => void) => {
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

	const handleExaminerChange = async () => {
		if (!selectedPostForExaminer || !selectedExaminerId) return;

		const requestedPostId = selectedPostForExaminer.id!;
		const examinerId = Number(selectedExaminerId);

		setIsSavingExaminer(requestedPostId);
		try {
			await JobRequestService.setExaminer({ requestedPostId, examinerId });
			setData((prev) =>
				prev.map((post) =>
					post.id === requestedPostId
						? { ...post, examinerId: examinerId, examiner: examiners.find((e) => e.id === examinerId) }
						: post
				)
			);
			toast({
				description: 'Examiner assigned successfully.',
				variant: 'success',
			});
			setSelectedPostForExaminer(null);
		} catch (error: any) {
			toast({
				description: error.message || 'Failed to assign examiner.',
				variant: 'danger',
			});
		} finally {
			setIsSavingExaminer(null);
		}
	};

	const handleOpenExaminerDialog = (item: RequestedPost) => {
		setSelectedPostForExaminer(item);
		setSelectedExaminerId(item.examinerId?.toString());
	};

	const statItems = [
		{ label: 'Total Applicants', value: applicantStats.total, status: null },
		{ label: 'Applied', value: applicantStats.APPLIED, status: APPLICATION_STATUS.APPLIED },
		{ label: 'Accepted', value: applicantStats.ACCEPTED, status: APPLICATION_STATUS.ACCEPTED },
	];

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
					<CardDescription className='flex flex-wrap items-center justify-between'>
						<div className='flex gap-4'>
							<span className='flex items-center gap-1.5'>
								<Building className='h-4 w-4' />
								{requestedPost.jobRequest?.clientOrganization?.nameEn}
							</span>
							<span className='flex items-center gap-1.5'>
								<Users className='h-4 w-4' />
								{requestedPost.vacancy} Vacancies
							</span>
						</div>
						{requestedPost.status === JobRequestedPostStatus.PENDING && (
							<div className='flex items-center gap-2 text-sm'>
								<span className='text-muted-foreground'>Examiner:</span>
								<span className='font-semibold'>{requestedPost.examiner?.nameEn || 'Not Assigned'}</span>
								<Button
									variant='ghost'
									size='icon'
									className='h-7 w-7'
									onClick={() => handleOpenExaminerDialog(requestedPost)}
								>
									<Edit className='h-4 w-4 text-primary' />
								</Button>
							</div>
						)}
					</CardDescription>
				</CardHeader>
			</Card>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				{statItems.map(
					(item) =>
						(item.status !== APPLICATION_STATUS.HIRED ||
							requestedPost.status !== JobRequestedPostStatus.PENDING) && (
							<Card
								key={item.label}
								onClick={() => setStatusFilter(item.status)}
								className={cn(
									'cursor-pointer transition-all hover:shadow-md hover:-translate-y-1',
									statusFilter === item.status ? 'bg-primary/10 border-primary' : 'bg-card'
								)}
							>
								<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
									<CardTitle className='text-sm font-medium'>{item.label}</CardTitle>
								</CardHeader>
								<CardContent>
									<div
										className={cn(
											'text-3xl font-bold',
											statusFilter === item.status ? 'text-primary' : 'text-foreground'
										)}
									>
										{item.value}
									</div>
								</CardContent>
							</Card>
						)
				)}
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

			<Dialog
				open={!!selectedPostForExaminer}
				onOpenChange={(open) => !open && setSelectedPostForExaminer(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Assign Examiner</DialogTitle>
						<DialogDescription>
							Select an examiner for the post: &quot;{selectedPostForExaminer?.post?.nameEn}&quot;.
						</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<div className='py-4'>
							<FormAutocomplete
								name='examinerId'
								label='Examiner'
								placeholder='Select an Examiner'
								options={examiners}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
								value={selectedExaminerId}
								onValueChange={setSelectedExaminerId}
								required
							/>
						</div>
					</Form>
					<DialogFooter>
						<Button variant='ghost' onClick={() => setSelectedPostForExaminer(null)}>
							Cancel
						</Button>
						<Button
							onClick={handleExaminerChange}
							disabled={isSavingExaminer === selectedPostForExaminer?.id}
						>
							{isSavingExaminer === selectedPostForExaminer?.id && (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							)}
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={isProceedConfirmationOpen} onOpenChange={setIsProceedConfirmationOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Proceed to Next Stage?</DialogTitle>
						<DialogDescription>
							You are about to move the selected applicants to the next stage of the recruitment process.
						</DialogDescription>
					</DialogHeader>
					<div className='space-y-4 py-4'>
						<Alert variant='warning'>
							<AlertTitle>Important</AlertTitle>
							<AlertDescription>
								Only applicants with the &quot;Accepted&quot; status will be moved to the next stage.
							</AlertDescription>
						</Alert>
						<div className='space-y-2'>
							<p className='font-medium'>Assign Examiner (Optional)</p>
							<FormAutocomplete
								control={null}
								name='proceedExaminerId'
								label=''
								placeholder='Search for an examining organization...'
								options={examiners}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.nameEn}
								value={proceedExaminerId?.toString()}
								onValueChange={(val) => setProceedExaminerId(Number(val))}
							/>
						</div>
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
		</div>
	);
}
