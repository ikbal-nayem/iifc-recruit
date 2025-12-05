
'use client';

import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ROLES } from '@/constants/auth.constant';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobRequest, JobRequestStatus, JobRequestType } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { cn } from '@/lib/utils';
import { JobRequestService } from '@/services/api/job-request.service';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Building, Calendar, Check, Edit, Eye, FileText, Loader2, Search, Trash } from 'lucide-react';
import * as React from 'react';

const initMeta: IMeta = { page: 0, limit: 20, totalRecords: 0 };

interface JobRequestListProps {
	status?: JobRequestStatus;
}

export function JobRequestList({ status }: JobRequestListProps) {
	const { currectUser } = useAuth();
	const [data, setData] = React.useState<JobRequest[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const [itemToDelete, setItemToDelete] = React.useState<JobRequest | null>(null);

	const isIifcAdmin = currectUser?.roles.includes(ROLES.IIFC_ADMIN);

	const loadItems = React.useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { searchKey: search, ...(status && { status }) },
					meta: { page, limit: meta.limit },
				};
				const response = await JobRequestService.getList(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast.error({
					description: error.message || 'Failed to load job requests.',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, status]
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
			toast.success({
				title: 'Request Updated',
				description: `The job request has been accepted.`,
			});
			loadItems(meta.page, debouncedSearch);
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to update job request status.',
			});
		}
	};

	const handleDelete = async () => {
		if (!itemToDelete?.id) return;
		try {
			await JobRequestService.delete(itemToDelete.id);
			toast.success({ description: 'Job request deleted successfully' });
			loadItems(meta.page, debouncedSearch);
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to delete job request.' });
		} finally {
			setItemToDelete(null);
		}
	};

	const getActionItems = (request: JobRequest): ActionItem[] => {
		const items: ActionItem[] = [
			{
				label: 'View Details',
				icon: <Eye className='mr-2 h-4 w-4' />,
				href:
					status === JobRequestStatus.PENDING
						? ROUTES.JOB_REQUEST.PENDING_DETAILS(request.id)
						: JobRequestStatus.PROCESSING
						? ROUTES.JOB_REQUEST.PROCESSING_DETAILS(request.id)
						: ROUTES.JOB_REQUEST.COMPLETED_DETAILS(request.id),
			},
		];

		if (!isIifcAdmin) return items;

		items.push({
			label: 'Edit',
			icon: <Edit className='mr-2 h-4 w-4' />,
			href: ROUTES.JOB_REQUEST.EDIT(request.id),
		});

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
		const isDeadlineSoon = differenceInDays(parseISO(item.deadline), new Date()) <= 7;

		return (
			<Card key={item.id} className='p-4 flex flex-col sm:flex-row justify-between items-start'>
				<div className='flex-1 mb-4 sm:mb-0 space-y-2'>
					<div className='flex gap-2 items-center'>
						<p className='font-semibold'>{item.subject}</p>
						<Badge variant={item.type === JobRequestType.OUTSOURCING ? 'secondary' : 'outline'}>
							{item.typeDTO?.nameEn}
						</Badge>
					</div>
					<div className='text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' /> {item.clientOrganization?.nameBn || 'N/A'}
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
						<Badge variant={getStatusVariant(item.status)}>{item.statusDTO?.nameEn}</Badge>
					</div>
					<div className='flex items-center gap-2'>
						{isIifcAdmin && item.status === JobRequestStatus.PENDING && (
							<Button
								size='sm'
								variant='success'
								onClick={() => handleStatusChange(item.id!, JobRequestStatus.PROCESSING)}
							>
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
			<CardContent className='pt-6 relative'>
				<div className='relative w-full'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
					<Input
						placeholder='Filter by subject or memo no...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='pl-10'
					/>
				</div>
				{isLoading && data.length > 0 && (
					<div className='absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10 mt-16'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
					</div>
				)}
				<div className='mt-4 space-y-4'>
					{isLoading && data.length === 0 ? (
						[...Array(2)].map((_, i) => <Skeleton key={i} className='h-24 w-full' />)
					) : data.length > 0 ? (
						data.map(renderItem)
					) : (
						<div className='text-center py-16 text-muted-foreground'>No job requests found.</div>
					)}
				</div>
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
