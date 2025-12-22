'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes.constant';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { RequestedPost } from '@/interfaces/job.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { generateApplicantReport } from '@/lib/reports/applicant-report';
import { ApplicationService } from '@/services/api/application.service';
import { JobRequestService } from '@/services/api/job-request.service';
import { ArrowLeft, ChevronsRight, FileDown, Filter, Loader2, Search, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApplicantFilterBar, ApplicantFilterValues } from './applicant-filter-bar';
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
	const [otherFilters, setOtherFilters] = useState<ApplicantFilterValues>({});
	const [statusFilter, setStatusFilter] = useState<string | null>(null);
	const [isProceedConfirmationOpen, setIsProceedConfirmationOpen] = useState(false);
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const loadApplicants = useCallback(
		async (
			page: number,
			filters: { status: string | null; search: string; other: ApplicantFilterValues }
		) => {
			setIsLoadingApplicants(true);
			try {
				const body: IApiRequest['body'] = {
					requestedPostId: requestedPost.id!,
					...filters.other,
					...(filters.status && { status: filters.status }),
					...(filters.search && { searchKey: filters.search }),
				};

				const payload: IApiRequest = {
					body,
					meta: { page, limit: applicantsMeta?.limit || initMeta.limit },
				};

				const response = await ApplicationService.search(payload);

				setApplicants(response.body);
				setApplicantsMeta(response.meta || initMeta);
			} catch (error: any) {
				console.log(error);
				toast.error({
					description: error.message || 'Failed to load applicants.',
				});
			} finally {
				setIsLoadingApplicants(false);
			}
		},
		[requestedPost.id, applicantsMeta.limit]
	);

	useEffect(() => {
		loadApplicants(0, { status: statusFilter, search: debouncedSearch, other: otherFilters });
	}, [JSON.stringify(otherFilters), statusFilter, debouncedSearch, loadApplicants]);

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
				loadApplicants(0, { status: statusFilter, search: debouncedSearch, other: otherFilters });
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
			loadApplicants(applicantsMeta.page, {
				status: statusFilter,
				search: debouncedSearch,
				other: otherFilters,
			});
			return resp;
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to update application.',
			});
		}
	};

	const handlePageChange = (newPage: number) => {
		loadApplicants(newPage, { status: statusFilter, search: debouncedSearch, other: otherFilters });
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
				reportTitle: 'Processing Candidates',
			};
		}
		if (isShortlisted) {
			return {
				title: 'Shortlisted Candidates',
				reportTitle: 'Shortlisted Candidates',
			};
		}
		return {
			title: 'Applied Candidates',
			reportTitle: 'Applied Candidates',
		};
	};

	const isProceedDisabled =
		(!isProcessing && acceptedApplicantsCount === 0) || (isProcessing && shortlistedApplicantsCount === 0);

	const cardTexts = getCardTexts();

	return (
		<div className='space-y-4'>
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
				<CardHeader className='flex-row items-center justify-between pb-3'>
					<div>
						<CardTitle>{cardTexts.title}</CardTitle>
					</div>
					<div className='flex items-center gap-2'>
						<Button
							variant='outline-info'
							onClick={() => generateApplicantReport(requestedPost, applicants, cardTexts.reportTitle)}
							disabled={applicants.length === 0}
						>
							<FileDown className='mr-2 h-4 w-4' />
							Generate Report
						</Button>
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
					</div>
				</CardHeader>
				<CardContent className='space-y-0'>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search by name, email or phone...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10 h-10'
							/>
						</div>
						<div className='flex items-center gap-2'>
							<Button variant='outline' onClick={() => setIsFilterOpen(true)}>
								<Filter className='mr-2 h-4 w-4' /> Filters
							</Button>
						</div>
					</div>

					<ApplicantFilterBar
						onFilterChange={setOtherFilters}
						isProcessing={isProcessing}
						isOpen={isFilterOpen}
						onOpenChange={setIsFilterOpen}
					/>
					<div className='mt-4'>
						<ApplicantsTable
							applicants={applicants}
							isLoading={isLoadingApplicants}
							meta={applicantsMeta}
							onPageChange={handlePageChange}
							updateApplication={handleUpdateApplication}
							requestedPostStatus={requestedPost.status}
							isProcessing={isProcessing}
							isShortlisted={isShortlisted}
							onListRefresh={() =>
								loadApplicants(0, { status: statusFilter, search: debouncedSearch, other: otherFilters })
							}
						/>
					</div>
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
