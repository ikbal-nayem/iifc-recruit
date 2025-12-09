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
import { toast } from '@/hooks/use-toast';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { RequestedPost } from '@/interfaces/job.interface';
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
	isShortlisted?: boolean;
}

const initMeta: IMeta = { page: 0, limit: 50, totalRecords: 0 };

export function ApplicationManagementPage({
	requestedPost: initialPost,
	statuses,
	isProcessing = false,
	isShortlisted = false,
}: ApplicationManagementPageProps) {
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

				let response;
				if (isShortlisted) {
					response = await ApplicationService.getShortlistedList(payload);
				} else if (isProcessing) {
					response = await ApplicationService.getProcessingList(payload);
				} else {
					response = await ApplicationService.getList(payload);
				}

				setApplicants(response.body);
				setApplicantsMeta(response.meta);
			} catch (error: any) {
				toast.error({
					description: error.message || 'Failed to load applicants.',
				});
			} finally {
				setIsLoadingApplicants(false);
			}
		},
		[requestedPost.id, applicantsMeta.limit, isProcessing, isShortlisted]
	);

	useEffect(() => {
		loadApplicants(0, statusFilter);
	}, [statusFilter, loadApplicants]);

	const handleApplyApplicants = (newApplicants: JobseekerSearch[], onSuccess?: () => void) => {
		const payload = newApplicants.map((js) => ({
			applicantId: js.userId,
			requestedPostId: requestedPost.id,
			status: APPLICATION_STATUS.ACCEPTED,
		}));
		ApplicationService.createAll(payload)
			.then((res) => {
				toast.success({
					title: 'Candidates Applied',
					description: `${newApplicants.length} candidate(s) have been added to the application list.`,
				});
				onSuccess && onSuccess();
				loadApplicants(0);
			})
			.catch((err) => {
				toast.error({
					description: err.message,
				});
			});
	};

	const handleUpdateApplication = async (updatedApplicants: Application[]) => {
		try {
			const resp = await ApplicationService.updateAll(updatedApplicants);
			toast.success({
				title: 'Application Updated',
				description: resp?.message,
			});
			loadApplicants(applicantsMeta.page);
			return resp;
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to update application.',
			});
		}
	};

	const handlePageChange = (newPage: number) => {
		loadApplicants(newPage, statusFilter);
	};

	const handleProceed = async () => {
		setIsProceeding(true);
		try {
			let redirectRoute = ROUTES.APPLICATION_PROCESSING;
			if (isProcessing) {
				await JobRequestService.proceedToShortlist(requestedPost.id!);
				redirectRoute = ROUTES.APPLICATION_SHORTLISTED;
			} else {
				await JobRequestService.proceedToProcess(requestedPost.id!);
			}
			toast.success({
				title: 'Request Processing',
				description: `The request has been moved to the next stage.`,
			});
			router.push(redirectRoute);
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to proceed to the next stage.',
			});
		} finally {
			setIsProceeding(false);
			setIsProceedConfirmationOpen(false);
		}
	};

	const getProceedButtonText = () => {
		if (isProcessing) return 'Proceed to Shortlist';
		return 'Proceed to Next Stage';
	};

	const acceptedApplicantsCount = applicants.filter(
		(app) => app.status === APPLICATION_STATUS.ACCEPTED
	).length;
	const shortlistedApplicantsCount = applicants.filter(
		(app) => app.status === APPLICATION_STATUS.SHORTLISTED
	).length;

	const getDialogDescription = () => {
		if (isProcessing) {
			return (
				<>
					This will finalize the list with{' '}
					<strong>{shortlistedApplicantsCount} shortlisted applicant(s)</strong>. Are you sure you want to
					proceed?
				</>
			);
		}

		if (isShortlisted) {
			return 'You are about to mark this entire job request as completed. This action cannot be undone.';
		}

		return (
			<>
				You are about to move <strong>{acceptedApplicantsCount} accepted applicant(s)</strong> to the
				shortlisting stage. Please confirm to proceed.
			</>
		);
	};

	const getCardTexts = () => {
		if (isProcessing) {
			return {
				title: 'Processing Candidates',
				description: 'Manage candidates who have been accepted for processing.',
			};
		}
		if (isShortlisted) {
			return {
				title: 'Shortlisted Candidates',
				description: 'Final candidates who have been shortlisted for the role.',
			};
		}
		return {
			title: 'Applied Candidates',
			description: 'These candidates have applied for the circular post.',
		};
	};

	const isProceedDisabled =
		(!isProcessing && acceptedApplicantsCount === 0) || (isProcessing && shortlistedApplicantsCount === 0);

	const cardTexts = getCardTexts();

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Button variant='outline' onClick={() => router.back()}>
					<ArrowLeft className='mr-2 h-4 w-4' />
					Back
				</Button>
				{!isShortlisted && (
					<Button onClick={() => setIsProceedConfirmationOpen(true)} size='lg' disabled={isProceedDisabled}>
						<ChevronsRight className='mr-2 h-4 w-4' />
						{getProceedButtonText()}
					</Button>
				)}
			</div>

			<ApplicationManagementHeader
				requestedPost={requestedPost}
				setRequestedPost={setRequestedPost}
				isProcessing={isProcessing || isShortlisted}
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
						<CardTitle>{cardTexts.title}</CardTitle>
						<CardDescription>{cardTexts.description}</CardDescription>
					</div>
					{!isProcessing && !isShortlisted && (
						<Dialog open={isAddCandidateOpen} onOpenChange={setIsAddCandidateOpen}>
							<DialogTrigger asChild>
								<Button variant='outline'>
									<UserPlus className='mr-2 h-4 w-4' />
									Add Candidate
								</Button>
							</DialogTrigger>
							<DialogContent
								className='max-w-7xl flex flex-col p-0'
								onPointerDownOutside={(e) => e.preventDefault()}
							>
								<DialogHeader className='p-6 pb-0'>
									<DialogTitle>Add Applicants to Primary List</DialogTitle>
								</DialogHeader>
								<div className='flex-1 overflow-y-auto px-6'>
									<ApplicantListManager onApply={handleApplyApplicants} />
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
						isProcessing={isProcessing}
						isShortlisted={isShortlisted}
					/>
				</CardContent>
			</Card>

			{!isShortlisted && (
				<div className='flex justify-center mt-6'>
					<Button onClick={() => setIsProceedConfirmationOpen(true)} size='lg' disabled={isProceedDisabled}>
						<ChevronsRight className='mr-2 h-4 w-4' />
						{getProceedButtonText()}
					</Button>
				</div>
			)}

			<Dialog open={isProceedConfirmationOpen} onOpenChange={setIsProceedConfirmationOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{isProcessing ? 'Proceed to Shortlist?' : 'Proceed to Next Stage?'}</DialogTitle>
						<DialogDescription>{getDialogDescription()}</DialogDescription>
					</DialogHeader>
					<div className='space-y-4 py-4'>
						{!isProcessing && !isShortlisted && (
							<>
								<div className='rounded-md border p-4 text-sm'>
									<p className='text-muted-foreground'>Assigned Examiner</p>
									<p className='font-semibold'>{requestedPost.examiner?.nameEn || 'Not Assigned'}</p>
								</div>
								<Alert variant='warning'>
									<AlertTitle>Important</AlertTitle>
									<AlertDescription>
										Only applicants with the &quot;Accepted&quot; status will be moved to the next stage.
										Ensure all desired candidates are marked as accepted before proceeding.
									</AlertDescription>
								</Alert>
							</>
						)}
						{isProcessing && !isShortlisted && (
							<Alert variant='warning'>
								<AlertTitle>Important</AlertTitle>
								<AlertDescription>
									Only applicants with the &quot;Shortlisted&quot; status will be moved to the next stage.
								</AlertDescription>
							</Alert>
						)}
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
