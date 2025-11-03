'use client';

import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { CircularService } from '@/services/api/circular.service';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { JobCard } from './job-card';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

const initMeta: IMeta = { page: 0, limit: 12, totalRecords: 0 };

export function JobListings({ isPaginated = true, showFilters = true, itemLimit = 12 }: JobListingsProps) {
	const searchParams = useSearchParams();
	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = React.useState(true);

	const [searchQuery, setSearchQuery] = React.useState(searchParams.get('q') || '');

	const searchJobs = React.useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { searchKey: search },
					meta: { page: page, limit: itemLimit },
				};
				const response = await CircularService.search(payload);
				setJobs(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to search jobs', error);
				toast.error({
					description: 'Failed to load job listings.',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit]
	);

	React.useEffect(() => {
		searchJobs(0, searchQuery);
	}, [searchQuery, searchJobs]);

	const handlePageChange = (newPage: number) => {
		searchJobs(newPage, searchQuery);
	};

	const FilterBar = () => (
		<div className='flex flex-col sm:flex-row gap-4 mb-8'>
			<div className='relative flex-grow'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
				<Input
					placeholder='Search by job title or organization...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='pl-10 h-12 w-full'
				/>
			</div>
		</div>
	);

	return (
		<div className='space-y-8'>
			{showFilters && <FilterBar />}

			{isLoading ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{[...Array(itemLimit)].map((_, i) => (
						<Skeleton key={i} className='h-64 w-full' />
					))}
				</div>
			) : jobs.length > 0 ? (
				<>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{jobs.map((job) => (
							<JobCard key={job.id} job={job} />
						))}
					</div>
					{isPaginated && meta && meta.totalRecords && meta.totalRecords > 0 && (
						<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={'Job'} />
					)}
				</>
			) : (
				<div className='text-center py-16'>
					<h3 className='text-xl font-semibold'>No Jobs Found</h3>
					<p className='text-muted-foreground mt-2'>
						We couldn't find any jobs matching your criteria. Try adjusting your filters.
					</p>
				</div>
			)}
		</div>
	);
}
