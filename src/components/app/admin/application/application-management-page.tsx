
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { ROUTES } from '@/constants/routes.constant';
import { useToast } from '@/hooks/use-toast';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { ApplicationService } from '@/services/api/application.service';
import { JobRequestService } from '@/services/api/job-request.service';
import { ArrowLeft, ChevronsRight, Loader2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApplicantListManager } from './applicant-list-manager';
import { ApplicantsTable } from './applicants-table';
import { ApplicationManagementHeader } from './application-management-header';
import { ApplicationStats } from './application-stats';

interface ApplicationManagementPageProps {
	requestedPost: RequestedPost;
	statuses: EnumDTO[];
	isProcessing?: boolean;
}

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

export function ApplicationManagementPage({
	requestedPost: initialPost,
	statuses,
	isProcessing = false,
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

	const loadApplicants = useCallback(
		async (page: number, status?: string | null) => {
			setIsLoadingApplicants(true);
			try {
				const payload: IApiRequest = {
					body: { requestedPostId: requestedPost.id, ...(status && { status: status }) },
					meta: { page, limit: applicantsMeta.limit },
				};
				const response = isProcessing
					? await ApplicationService.getProcessingList(payload)
					: await ApplicationService.getList(payload);
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
		[requestedPost.id, toast, applicantsMeta.limit, isProcessing]
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

	const handleProceed = async () => {
		if (!isProcessing && !requestedPost.examinerId) {
			toast({
				title: 'Examiner Required',
				description: 'Please assign an examiner before proceeding.',
				variant: 'warning',
			});
			setIsProceedConfirmationOpen(false);
			return;
		}

		setIsProceeding(true);
		try {
			const targetStatus = isProcessing ? JobRequestStatus.SHORTLISTED : JobRequestStatus.PROCESSING;
			await JobRequestService.updateStatus(requestedPost.id!, targetStatus);
			toast({
				title: 'Request Processing',
				description: `The request has been moved to the ${targetStatus.toLowerCase()} stage.`,
				variant: 'success',
			});

			const redirectRoute = isProcessing ? ROUTES.APPLICATION_SHORTLISTED : ROUTES.APPLICATION_PROCESSING;
			router.push(redirectRoute);
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

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back
				</Button>
				<Button onClick={() => setIsProceedConfirmationOpen(true)} size='lg'>
					<ChevronsRight className='mr-2 h-4 w-4' />
					Proceed to {isProcessing ? 'Shortlist' : 'Next Stage'}
				</Button>
			</div>

			<ApplicationManagementHeader
				requestedPost={requestedPost}
				setRequestedPost={setRequestedPost}
				isProcessing={isProcessing}
			/>

			<ApplicationStats
				statuses={statuses}
				applicants={applicants}
				statusFilter={statusFilter}
				onFilterChange={setStatusFilter}
			/>

			<Card>
				<CardHeader className='flex-row items-center justify-between'>
					<div>
						<CardTitle>Applied Candidates</CardTitle>
						<CardDescription>These candidates have applied for the circular post.</CardDescription>
					</div>
					{!isProcessing && (
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
					)}
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
					Proceed to {isProcessing ? 'Shortlist' : 'Next Stage'}
				</Button>
			</div>

			<Dialog open={isProceedConfirmationOpen} onOpenChange={setIsProceedConfirmationOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Proceed to {isProcessing ? 'Shortlist' : 'Next Stage'}?</DialogTitle>
						<DialogDescription>
							You are about to move the selected applicants to the{' '}
							{isProcessing ? 'shortlisted' : 'processing'} stage.
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
		</div>
	);
}
