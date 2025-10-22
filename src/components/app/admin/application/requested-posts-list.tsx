'use client';

import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobRequestedPostStatus, JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { getStatusVariant, isNull } from '@/lib/utils';
import { getExaminerAsync } from '@/services/async-api';
import { JobRequestService } from '@/services/api/job-request.service';
import { Building, Edit, Loader2, Search, UserCog, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

interface RequestedPostsListProps {
	status: JobRequestStatus;
}

export function RequestedPostsList({ status }: RequestedPostsListProps) {
	const [data, setData] = useState<RequestedPost[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { toast } = useToast();
	const [isSavingExaminer, setIsSavingExaminer] = useState<number | null>(null);
	const [selectedPostForExaminer, setSelectedPostForExaminer] = useState<RequestedPost | null>(null);
	const [selectedExaminerId, setSelectedExaminerId] = useState<string | undefined>();
	const form = useForm();

	const loadItems = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { nameEn: search, status: status },
					meta: { page, limit: meta.limit },
				};
				const response = await JobRequestService.getRequestedPosts(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast({
					description: error.message || 'Failed to load requested posts.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast, status]
	);

	useEffect(() => {
		loadItems(0, debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const getActionItems = (item: RequestedPost): ActionItem[] => {
		const items: ActionItem[] = [];

		if (item.status === JobRequestedPostStatus.PENDING) {
			items.push({
				label: 'Manage Applicants',
				icon: <UserCog className='mr-2 h-4 w-4' />,
				href: ROUTES.APPLICATION_MANAGE(item.id),
			});
		} else {
			items.push({
				label: 'View Applicants',
				icon: <UserCog className='mr-2 h-4 w-4' />,
				href: ROUTES.APPLICATION_MANAGE(item.id),
			});
		}
		return items;
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
						? {
								...post,
								examinerId: examinerId,
						  }
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

	const renderItem = (item: RequestedPost) => {
		return (
			<Card key={item.id} className='p-4 flex flex-col sm:flex-row justify-between items-start'>
				<div className='flex-1 mb-4 sm:mb-0 space-y-3'>
					<div className='flex items-center gap-2'>
						<p className='font-semibold'>{item.post?.nameEn}</p>
						<Badge variant={getStatusVariant(item.status)}>{item.statusDTO?.nameEn}</Badge>
					</div>
					<div className='text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-2'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' /> {item.jobRequest?.clientOrganization?.nameEn || 'N/A'}
						</span>
						<span className='flex items-center gap-1.5'>
							<Users className='h-4 w-4' /> {item.vacancy} vacancies
						</span>
						<span className='flex items-center gap-1.5 font-medium'>
							<UserCog className='h-4 w-4' /> {item.totalApplied || 0} applicants
						</span>
					</div>
					{status === JobRequestStatus.PENDING && (
						<div className='flex items-center gap-2 text-sm'>
							<span className='text-muted-foreground'>Examiner:</span>
							<span className='font-semibold'>{item.examiner?.nameEn || 'Not Assigned'}</span>
							<Button
								variant='ghost'
								size='icon'
								className='h-7 w-7'
								onClick={() => handleOpenExaminerDialog(item)}
							>
								<Edit className='h-4 w-4 text-primary' />
							</Button>
						</div>
					)}
				</div>
				<div className='flex items-center gap-4 w-full sm:w-auto justify-end'>
					<ActionMenu items={getActionItems(item)} />
				</div>
			</Card>
		);
	};

	return (
		<>
			<Card className='glassmorphism'>
				<CardContent className='pt-6 space-y-4'>
					<div className='relative w-full max-w-sm'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search by post name...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
					<div className='space-y-4'>
						{isLoading ? (
							[...Array(5)].map((_, i) => <Skeleton key={i} className='h-32 sm:h-24 w-full' />)
						) : data.length > 0 ? (
							data.map(renderItem)
						) : (
							<div className='text-center py-16 text-muted-foreground'>No data found.</div>
						)}
					</div>
				</CardContent>
				{meta && meta.totalRecords! > 0 && (
					<CardFooter>
						<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='post' />
					</CardFooter>
				)}
			</Card>

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
								placeholder='Search for an examining organization...'
								required
								loadOptions={getExaminerAsync}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
								value={selectedExaminerId}
								onValueChange={setSelectedExaminerId}
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
		</>
	);
}
