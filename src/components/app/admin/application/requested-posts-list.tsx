
'use client';

import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobRequestedPostStatus, JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { JobRequestService } from '@/services/api/job-request.service';
import { Building, Search, UserCog, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

interface RequestedPostsListProps {
	status: JobRequestedPostStatus;
}

export function RequestedPostsList({ status }: RequestedPostsListProps) {
	const [data, setData] = useState<RequestedPost[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { toast } = useToast();

	const loadItems = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { searchKey: search, status: status },
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
		let manageHref = '';

		switch (item.status) {
			case JobRequestedPostStatus.PENDING:
				manageHref = ROUTES.MANAGE_PENDING_APPLICATION(item.id);
				break;
			case JobRequestedPostStatus.PROCESSING:
				manageHref = ROUTES.MANAGE_PROCESSING_APPLICATION(item.id);
				break;
			case JobRequestedPostStatus.SHORTLISTED:
				manageHref = ROUTES.MANAGE_SHORTLISTED_APPLICATION(item.id);
				break;
			default:
				// No action for completed or other statuses for now
				break;
		}

		if (manageHref) {
			items.push({
				label: 'Manage Applicants',
				icon: <UserCog className='mr-2 h-4 w-4' />,
				href: manageHref,
			});
		}

		return items;
	};

	const renderItem = (item: RequestedPost) => {
		return (
			<Card key={item.id} className='p-4 flex flex-col sm:flex-row justify-between items-start'>
				<div className='flex-1 mb-4 sm:mb-0 space-y-3'>
					<div className='flex items-center gap-2'>
						<p className='font-semibold'>{item.post?.nameEn}</p>
						<Badge variant={getStatusVariant(item.status)}>{item.statusDTO?.nameEn}</Badge>
					</div>
					<div className='text-sm text-muted-foreground flex flex-wrap gap-x-5 gap-y-2'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' /> {item.jobRequest?.clientOrganization?.nameEn || 'N/A'}
						</span>
						<span className='flex items-center gap-1.5'>
							<Users className='h-4 w-4' /> {item.vacancy} vacancies
						</span>
						<Badge variant='outline' className='flex items-center gap-1.5'>
							<span className='text-muted-foreground'>Examiner:</span>
							<span className='font-semibold'>{item.examiner?.nameEn || 'Not Assigned'}</span>
						</Badge>
					</div>
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
		</>
	);
}
