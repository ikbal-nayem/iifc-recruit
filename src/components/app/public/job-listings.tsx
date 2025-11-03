
'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { CircularService } from '@/services/api/circular.service';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { Form } from '@/components/ui/form';
import { FormSelect } from '@/components/ui/form-select';
import { JobCard } from './job-card';
import { LayoutGrid, List, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

const initMeta: IMeta = { page: 0, limit: 12, totalRecords: 0 };

type FilterFormValues = {
	searchKey: string;
	jobType: string;
};

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit = 12,
}: JobListingsProps) {
	const searchParams = useSearchParams();
	const isMobile = useIsMobile();
	const [view, setView] = React.useState<'grid' | 'list'>(isMobile ? 'list' : 'grid');

	const form = useForm<FilterFormValues>({
		defaultValues: {
			searchKey: searchParams.get('searchKey') || '',
			jobType: searchParams.get('jobType') || 'all',
		},
	});

	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = React.useState(true);

	const searchKey = form.watch('searchKey');
	const jobType = form.watch('jobType');
	const debouncedSearch = useDebounce(searchKey, 500);

	React.useEffect(() => {
		setView(isMobile ? 'list' : 'grid');
	}, [isMobile]);

	const loadJobs = React.useCallback(
		async (page: number, search: string, type: string) => {
			setIsLoading(true);
			const payload: IApiRequest = {
				body: {
					searchKey: search,
					...(type !== 'all' && { outsourcing: type === 'outsourcing' }),
				},
				meta: { page: page, limit: meta.limit },
			};
			try {
				const res = await CircularService.search(payload);
				setJobs(res.body);
				setMeta(res.meta);
			} catch (error) {
				console.error('Failed to load jobs', error);
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	React.useEffect(() => {
		loadJobs(0, debouncedSearch, jobType);
	}, [debouncedSearch, jobType, loadJobs]);

	const handlePageChange = (newPage: number) => {
		loadJobs(newPage, debouncedSearch, jobType);
	};

	const queryParams = new URLSearchParams(searchParams.toString());
	if (debouncedSearch) queryParams.set('searchKey', debouncedSearch);
	else queryParams.delete('searchKey');
	if (jobType !== 'all') queryParams.set('jobType', jobType);
	else queryParams.delete('jobType');

	const backUrl = `/jobs?${queryParams.toString()}`;

	return (
		<div className='space-y-6'>
			{showFilters && (
				<Card className='glassmorphism p-4'>
					<Form {...form}>
						<form className='flex flex-col gap-4'>
							<div className='flex flex-col md:flex-row gap-4'>
								<div className='relative flex-1'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
									<Input
										{...form.register('searchKey')}
										placeholder='Search by job title or organization...'
										className='pl-10 h-11'
									/>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-4'>
									<FormSelect
										control={form.control}
										name='jobType'
										label=''
										placeholder='Filter by Job Type...'
										options={[
											{ value: 'all', label: 'All Job Types' },
											{ value: 'permanent', label: 'Permanent' },
											{ value: 'outsourcing', label: 'Outsourcing' },
										]}
										getOptionValue={(option) => option.value}
										getOptionLabel={(option) => option.label}
									/>
									<div className='flex items-center gap-1 rounded-md bg-muted p-1'>
										<Button
											size='icon'
											variant={view === 'grid' ? 'default' : 'ghost'}
											onClick={() => setView('grid')}
											className='h-8 w-8'
										>
											<LayoutGrid className='h-4 w-4' />
										</Button>
										<Button
											size='icon'
											variant={view === 'list' ? 'default' : 'ghost'}
											onClick={() => setView('list')}
											className='h-8 w-8'
										>
											<List className='h-4 w-4' />
										</Button>
									</div>
								</div>
							</div>
						</form>
					</Form>
				</Card>
			)}

			<div>
				<div
					className={cn(
						'grid gap-6',
						view === 'grid'
							? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
							: 'grid-cols-1'
					)}
				>
					{isLoading
						? Array.from({ length: meta.limit }).map((_, i) => (
								<Skeleton key={i} className='h-56 w-full' />
						  ))
						: jobs.map((job) => <JobCard key={job.id} job={job} backUrl={backUrl} view={view} />)}
				</div>
				{!isLoading && jobs.length === 0 && (
					<div className='py-20 text-center'>
						<h3 className='text-xl font-semibold'>No Jobs Found</h3>
						<p className='text-muted-foreground mt-2'>
							Your search did not match any job listings. Try different keywords or filters.
						</p>
					</div>
				)}
			</div>
			{isPaginated && meta && meta.totalRecords && meta.totalRecords > meta.limit && (
				<div className='flex justify-center'>
					<Pagination meta={meta} onPageChange={handlePageChange} noun='job' />
				</div>
			)}
		</div>
	);
}
