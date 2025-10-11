
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobRequest } from '@/interfaces/job.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { format } from 'date-fns';
import { Check, Clock, Edit, Eye, Search, X } from 'lucide-react';
import * as React from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';

const JobRequestDetailView = ({ request }: { request: JobRequest }) => {
	if (!request) return null;

	return (
		<div>
			<DialogHeader className='mb-4'>
				<DialogTitle className='text-2xl'>{request.subject}</DialogTitle>
				<DialogDescription>
					From: {request.clientOrganization?.nameEn} | Memo: {request.memoNo}
				</DialogDescription>
			</DialogHeader>

			<div className='space-y-6 text-sm'>
				<div className='grid grid-cols-2 gap-4 rounded-md border p-4'>
					<div>
						<p className='font-medium text-muted-foreground'>Request Date</p>
						<p>{format(new Date(request.requestDate), 'PPP')}</p>
					</div>
					<div>
						<p className='font-medium text-muted-foreground'>Deadline</p>
						<p>{format(new Date(request.deadline), 'PPP')}</p>
					</div>
					<div>
						<p className='font-medium text-muted-foreground'>Request Type</p>
						<p>{request.requestTypeDTO?.nameEn}</p>
					</div>
					<div>
						<p className='font-medium text-muted-foreground'>Status</p>
						<Badge
							variant={
								request.status === 'Approved'
									? 'success'
									: request.status === 'Rejected'
									? 'danger'
									: 'warning'
							}
						>
							{request.statusDTO?.nameEn}
						</Badge>
					</div>
				</div>

				{request.description && (
					<div>
						<h4 className='font-semibold mb-1'>Description</h4>
						<p className='text-muted-foreground'>{request.description}</p>
					</div>
				)}

				<div>
					<h4 className='font-semibold mb-2'>Requested Posts</h4>
					<div className='space-y-3'>
						{request.requestedPosts.map((post, index) => (
							<div key={index} className='p-3 border rounded-md bg-muted/50'>
								<p className='font-semibold'>{post.post?.nameEn}</p>
								<div className='flex justify-between items-center text-muted-foreground'>
									<span>Vacancy: {post.vacancy}</span>
									{request.requestType === 'OUTSOURCING' ? (
										<span>Zone: {post.outsourcingZoneId}</span>
									) : (
										<span>
											Salary: {post.salaryFrom} - {post.salaryTo}
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<DialogFooter className='mt-6'>
				<Button asChild>
					<Link href={`/admin/job-management/request/edit/${request.id}`}>
						<Edit className='mr-2 h-4 w-4' /> Edit Request
					</Link>
				</Button>
			</DialogFooter>
		</div>
	);
};

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

export function JobRequestList() {
	const [data, setData] = React.useState<JobRequest[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { toast } = useToast();
	const [itemToDelete, setItemToDelete] = React.useState<JobRequest | null>(null);
	const [itemToView, setItemToView] = React.useState<JobRequest | null>(null);

	const loadItems = React.useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { subject: search },
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
		[meta.limit, toast]
	);

	React.useEffect(() => {
		loadItems(0, debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const handleStatusChange = (requestId: string, newStatus: JobRequest['status']) => {
		setData((prevData) =>
			prevData.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
		);
		toast({
			title: 'Request Updated',
			description: `The job request has been ${newStatus?.toLowerCase()}.`,
			variant: 'success',
		});
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
				onClick: () => setItemToView(request),
			},
			{
				label: 'Edit',
				icon: <Edit className='mr-2 h-4 w-4' />,
				href: `/admin/job-management/request/edit/${request.id}`,
			},
		];

		if (request.status === 'Pending') {
			items.push(
				{ isSeparator: true },
				{
					label: 'Approve',
					icon: <Check className='mr-2 h-4 w-4' />,
					onClick: () => handleStatusChange(request.id!, 'Approved'),
				},
				{
					label: 'Reject',
					icon: <X className='mr-2 h-4 w-4' />,
					onClick: () => handleStatusChange(request.id!, 'Rejected'),
					variant: 'danger',
				}
			);
		} else {
			items.push(
				{ isSeparator: true },
				{
					label: 'Set to Pending',
					icon: <Clock className='mr-2 h-4 w-4' />,
					onClick: () => handleStatusChange(request.id!, 'Pending'),
				}
			);
		}
		return items;
	};

	const renderItem = (item: JobRequest) => {
		const status = item.status;
		const variant =
			status === 'Approved' ? 'success' : status === 'Rejected' ? 'danger' : 'warning';

		return (
			<Card key={item.id} className='p-4 flex flex-col sm:flex-row justify-between items-start'>
				<div className='flex-1 mb-4 sm:mb-0'>
					<p className='font-semibold'>{item.subject}</p>
					<div className='text-sm text-muted-foreground'>
						{item.clientOrganization?.nameEn || 'N/A'} ({item.memoNo})
					</div>
					<div className='text-xs text-muted-foreground mt-1'>
						Requested on {format(new Date(item.requestDate), 'PPP')} | Deadline:{' '}
						{format(new Date(item.deadline), 'PPP')}
					</div>
				</div>
				<div className='flex items-center gap-4 w-full sm:w-auto justify-between'>
					<div className='flex items-center gap-2'>
						<Badge variant={variant as any}>{item.statusDTO?.nameEn}</Badge>
						<Badge variant='outline'>{item.requestTypeDTO?.nameEn}</Badge>
					</div>
					<ActionMenu items={getActionItems(item)} />
				</div>
			</Card>
		);
	};

	return (
		<Card className='glassmorphism'>
			<CardHeader>
				<CardTitle>All Job Requests</CardTitle>
				<div className='relative w-full max-w-sm mt-2'>
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
					[...Array(5)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
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

			<Dialog open={!!itemToView} onOpenChange={(open) => !open && setItemToView(null)}>
				<DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
					{itemToView && <JobRequestDetailView request={itemToView} />}
				</DialogContent>
			</Dialog>
		</Card>
	);
}
