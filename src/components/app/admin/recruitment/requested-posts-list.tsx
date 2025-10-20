
'use client';

import { ActionMenu } from '@/components/ui/action-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { RequestedPost } from '@/interfaces/job.interface';
import { JobRequestService } from '@/services/api/job-request.service';
import { Building, Search, Users2 } from 'lucide-react';
import React from 'react';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

export function RequestedPostsList() {
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
					body: { 'post.nameEn': search, status_not: 'COMPLETED' },
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
		[meta.limit, toast]
	);

	React.useEffect(() => {
		loadItems(0, debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const renderItem = (item: RequestedPost) => {
		return (
			<Card key={item.id} className='p-4 flex flex-col sm:flex-row justify-between items-start'>
				<div className='flex-1 mb-4 sm:mb-0 space-y-2'>
					<p className='font-semibold'>
						{item.post?.nameEn} <span className='text-muted-foreground'>({item.vacancy} vacancies)</span>
					</p>
					<div className='text-sm text-muted-foreground flex items-center gap-2'>
						<Building className='h-4 w-4' /> {item.jobRequest?.clientOrganization?.nameEn || 'N/A'}
					</div>
				</div>
				<div className='flex items-center gap-4 w-full sm:w-auto justify-between'>
					<Badge>{item.statusDTO?.nameEn}</Badge>
					<ActionMenu
						items={[
							{
								label: 'Manage Applicants',
								icon: <Users2 className='mr-2 h-4 w-4' />,
								href: ROUTES.REQUESTED_POST_DETAILS(item.id),
							},
						]}
					/>
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
						<div className='text-center py-16 text-muted-foreground'>No active posts found.</div>
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
