
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
import { JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { getStatusVariant } from '@/lib/utils';
import { Building, Search, UserCog, Users } from 'lucide-react';
import React from 'react';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

interface RequestedPostsListProps {
	status: JobRequestStatus;
}

export function RequestedPostsList({ status }: RequestedPostsListProps) {
	const [data, setData] = React.useState<RequestedPost[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { toast } = useToast();

	const loadItems = React.useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { 'post.nameEn': search, status: status },
					meta: { page, limit: meta.limit },
				};
				const response = await JobRequestService.getRequestedPosts(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast({
					title: 'Error',
					description: error.message || 'Failed to load requested posts.',
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

	const getActionItems = (item: RequestedPost): ActionItem[] => {
		const items: ActionItem[] = [];

		if (item.status === 'PENDING') {
			items.push({
				label: 'Manage Applicants',
				icon: <UserCog className='mr-2 h-4 w-4' />,
				href: ROUTES.APPLICATION_MANAGE(item.id),
			});
		} else {
			items.push({
				label: 'View Applicants',
				icon: <UserCog className='mr-2 h-4 w-4' />,
				href: ROUTES.APPLICATION_MANAGE(item.id), // Placeholder for now
			});
		}
		return items;
	};

	const renderItem = (item: RequestedPost) => {
		return (
			<Card key={item.id} className='p-4 flex flex-col sm:flex-row justify-between items-start'>
				<div className='flex-1 mb-4 sm:mb-0 space-y-2'>
					<p className='font-semibold'>{item.post?.nameEn}</p>
					<div className='text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1'>
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
				</div>
				<div className='flex items-center gap-4 w-full sm:w-auto justify-between'>
					<Badge variant={getStatusVariant(item.status)}>{item.statusDTO?.nameEn}</Badge>
					<ActionMenu items={getActionItems(item)} />
				</div>
			</Card>
		);
	};

	return (
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
						[...Array(5)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
					) : data.length > 0 ? (
						data.map(renderItem)
					) : (
						<div className='text-center py-16 text-muted-foreground'>No posts found for this status.</div>
					)}
				</div>
			</CardContent>
			{meta && meta.totalRecords! > 0 && (
				<CardFooter>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='post' />
				</CardFooter>
			)}
		</Card>
	);
}
