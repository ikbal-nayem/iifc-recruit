'use client';

import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobRequest, JobRequestStatus, JobRequestType } from '@/interfaces/job.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { cn } from '@/lib/utils';
import { differenceInDays, format, parseISO } from 'date-fns';
import {
	Building,
	Calendar,
	Check,
	CheckCircle,
	Clock,
	Edit,
	Eye,
	FileText,
	Play,
	Search,
	Trash,
} from 'lucide-react';
import * as React from 'react';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

interface JobRequestListProps {
	status?: JobRequestStatus;
}

export function JobRequestList({ status }: JobRequestListProps) {
	const [data, setData] = React.useState<JobRequest[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { toast } = useToast();
	const [itemToDelete, setItemToDelete] = React.useState<JobRequest | null>(null);

	const loadItems = React.useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { subject: search, ...(status && { status }) },
					meta: { page, limit: meta.limit },
				};
				const response = await JobRequestService.getList(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast({
					title: 'Error',
					description: error.message || 'Failed to load job requests.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast, status]
	);

	React.useEffect(() => {
		loadItems(0, debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const handleStatusChange = async (requestId: string, newStatus: JobRequest['status']) => {
		try {
			await JobRequestService.updateStatus(requestId, newStatus!);
			toast({
				title: 'Request Updated',
				description: `The job request has been accepted.`,
				variant: 'success',
			});
			loadItems(meta.page, debouncedSearch);
		} catch (error: any) {
			toast({
				description: error.message || 'Failed to update job request status.',
				variant: 'danger',
			});
		}
	};

	const handleDelete = async () => {
		if (!itemToDelete?.id) return;
		try {
			await JobRequestService.delete(itemToDelete.id);
			toast({ description: 'Job request deleted successfully', variant: 'success' });
			loadItems(meta.page, debouncedSearch);
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to delete job request.',
				variant: 'danger',
			});
		} finally {
			setItemToDelete(null);
		}
	};

	const getActionItems = (request: JobRequest): ActionItem[] => {
		const items: ActionItem[] = [
			{
				label: 'View Details',
				icon: <Eye className='mr-2 h-4 w-4' />,
				href: `/admin/job-management/request/${request.id}`,
			},
			{
				label: 'Edit',
				icon: <Edit className='mr-2 h-4 w-4' />,
				href: `/admin/job-management/request/edit/${request.id}`,
			},
		];

		if (request.status === JobRequestStatus.PENDING) {
			items.push(
				{ isSeparator: true },
				{
					label: 'Accept Request',
					icon: <Check className='mr-2 h-4 w-4' />,
					onClick: () => handleStatusChange(request.id!, JobRequestStatus.PROCESSING),
				}
			);
		}

		if (request.status === JobRequestStatus.PROCESSING) {
			items.push(
				{ isSeparator: true },
				{
					label: 'Mark as Completed',
					icon: <CheckCircle className='mr-2 h-4 w-4' />,
					onClick: () => handleStatusChange(request.id!, JobRequestStatus.COMPLETED),
				}
			);
		}

		items.push(
			{ isSeparator: true },
			{
				label: 'Delete',
				icon: <Trash className='mr-2 h-4 w-4' />,
				onClick: () => setItemToDelete(request),
				variant: 'danger',
			}
		);
		return items;
	};

	const renderItem = (item: JobRequest) => {
		const requestStatus = item.status;
		const variant =
			requestStatus === JobRequestStatus.COMPLETED
				? 'success'
				: requestStatus === JobRequestStatus.PROCESSING
				? 'info'
				: requestStatus === JobRequestStatus.PENDING
				? 'warning'
				: 'secondary';

		const isDeadlineSoon = differenceInDays(parseISO(item.deadline), new Date()) <= 7;

		return (
			<Card key={item.id} className='p-4 flex flex-col sm:flex-row justify-between items-start'>
				<div className='flex-1 mb-4 sm:mb-0 space-y-2'>
					<div className='flex gap-1'>
						<p className='font-semibold'>{item.subject}</p>
						<Badge variant={item.type === JobRequestType.OUTSOURCING ? 'secondary' : 'outline'}>
							{item.typeDTO?.nameEn}
						</Badge>
					</div>
					<div className='text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' /> {item.clientOrganization?.nameEn || 'N/A'}
						</span>
						<span className='flex items-center gap-1.5'>
							<FileText className='h-4 w-4' /> Memo: {item.memoNo}
						</span>
						<span className={cn('flex items-center gap-1.5', isDeadlineSoon && 'text-danger font-medium')}>
							<Calendar className='h-4 w-4' /> Deadline: {format(new Date(item.deadline), 'PPP')}
						</span>
					</div>
				</div>
				<div className='flex items-center gap-4 w-full sm:w-auto justify-between'>
					<div className='flex items-center gap-2'>
						<Badge variant={variant}>{item.statusDTO?.nameEn}</Badge>
					</div>
					<div className='flex items-center gap-2'>
						{item.status === JobRequestStatus.PENDING && (
							<Button size='sm' onClick={() => handleStatusChange(item.id!, JobRequestStatus.PROCESSING)}>
								<Check className='mr-2 h-4 w-4' /> Accept
							</Button>
						)}
						<ActionMenu items={getActionItems(item)} />
					</div>
				</div>
			</Card>
		);
	};

	return (
		<Card className='glassmorphism'>
			<CardHeader>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Filter by subject or memo no...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-10'
					/>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				{isLoading ? (
					[...Array(5)].map((_, i) => <Skeleton key={i} className='h-24 w-full' />)
				) : data.length > 0 ? (
					data.map(renderItem)
				) : (
					<div className='text-center py-16 text-muted-foreground'>No job requests found.</div>
				)}
			</CardContent>
			{meta && meta.totalRecords! > 0 && (
				<CardFooter>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='request' />
				</CardFooter>
			)}
			<ConfirmationDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
				title='Are you sure?'
				description='This will permanently delete the job request. This action cannot be undone.'
				onConfirm={handleDelete}
			/>
		</Card>
	);
}
