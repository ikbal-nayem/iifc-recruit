'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { cn } from '@/lib/utils';
import { CircularService } from '@/services/api/circular.service';
import { LayoutGrid, List, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { JobCard } from './job-card';

const initMeta: IMeta = { page: 0, limit: 12 };

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

export function JobListings({ isPaginated = true, showFilters = true, itemLimit = 10 }: JobListingsProps) {
	const searchParams = useSearchParams();
	const [circulars, setCirculars] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = React.useState(true);

	const [searchQuery, setSearchQuery] = React.useState(searchParams.get('q') || '');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const [view, setView] = React.useState<'grid' | 'list'>('grid');

	const loadCirculars = React.useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { searchKey: search },
					meta: { page: page, limit: itemLimit },
				};
				const response = await CircularService.search(payload);
				setCirculars(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				console.error('Failed to load circulars', error);
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit]
	);

	React.useEffect(() => {
		loadCirculars(0, debouncedSearch);
	}, [debouncedSearch, loadCirculars]);

	const handlePageChange = (newPage: number) => {
		loadCirculars(newPage, debouncedSearch);
	};

	const renderSkeletons = () => (
		<div
			className={cn(
				'grid gap-6',
				view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
			)}
		>
			{Array.from({ length: itemLimit }).map((_, index) => (
				<Card key={index} className='p-6 animate-pulse bg-muted/50'>
					<div className='h-6 bg-muted rounded w-3/4 mb-4'></div>
					<div className='h-4 bg-muted rounded w-1/2 mb-2'></div>
					<div className='h-4 bg-muted rounded w-1/3'></div>
				</Card>
			))}
		</div>
	);

	return (
		<div className='space-y-4'>
			{showFilters && (
				<Card className='p-4 glassmorphism'>
					<div className='relative w-full'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search by job title...'
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10 h-12'
						/>
					</div>
					<div className='flex items-center justify-between mt-3'>
						<strong className='text-sm text-muted-foreground'>
							Job found: <strong>{(meta?.totalRecords || 0).toLocaleString()}</strong>
						</strong>
						<div className='flex items-center justify-end gap-2'>
							<Button
								variant={view === 'grid' ? 'default' : 'outline'}
								size='icon'
								onClick={() => setView('grid')}
							>
								<LayoutGrid className='h-5 w-5' />
							</Button>
							<Button
								variant={view === 'list' ? 'default' : 'outline'}
								size='icon'
								onClick={() => setView('list')}
							>
								<List className='h-5 w-5' />
							</Button>
						</div>
					</div>
				</Card>
			)}

			{isLoading ? (
				renderSkeletons()
			) : circulars.length > 0 ? (
				<div
					className={cn(
						'grid gap-4',
						view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
					)}
				>
					{circulars.map((job) => (
						<JobCard key={job.id} job={job} view={view} searchParams={searchParams} />
					))}
				</div>
			) : (
				<div className='text-center py-16 text-muted-foreground'>No jobs found for your criteria.</div>
			)}

			{isPaginated && meta && meta.totalRecords! > 0 && (
				<div className='flex justify-center'>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={'Job'} />
				</div>
			)}
		</div>
	);
}
