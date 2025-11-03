
'use client';

import { Form, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { CircularService } from '@/services/api/circular.service';
import { Grid, List, Loader2, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { JobCard } from './job-card';
import { IOutsourcingZone } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { FormSelect } from '@/components/ui/form-select';
import { cn } from '@/lib/utils';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

interface FilterValues {
	searchKey: string;
	zoneId: string;
}

const initMeta: IMeta = { page: 0, limit: 12, totalRecords: 0 };

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit,
}: JobListingsProps) {
	const searchParams = useSearchParams();
	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit || initMeta.limit });
	const [isLoading, setIsLoading] = React.useState(true);
	const [zones, setZones] = React.useState<IOutsourcingZone[]>([]);
	const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

	const form = useForm<FilterValues>({
		defaultValues: {
			searchKey: searchParams.get('query') || '',
			zoneId: 'all',
		},
	});

	const searchKey = form.watch('searchKey');
	const zoneId = form.watch('zoneId');

	const debouncedSearch = useDebounce(searchKey, 500);

	const loadJobs = React.useCallback(
		async (page: number, filters: Partial<FilterValues>) => {
			setIsLoading(true);
			const payload: IApiRequest = {
				body: {
					searchKey: filters.searchKey,
					...(filters.zoneId !== 'all' && { zoneId: filters.zoneId }),
				},
				meta: { page, limit: meta.limit },
			};
			try {
				const response = await CircularService.search(payload);
				setJobs(response.body || []);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load jobs:', error);
				setJobs([]);
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	React.useEffect(() => {
		const fetchZones = async () => {
			try {
				const response = await MasterDataService.outsourcingZone.get();
				setZones(response.body || []);
			} catch (error) {
				console.error('Failed to load zones:', error);
			}
		};
		fetchZones();
	}, []);

	React.useEffect(() => {
		loadJobs(0, { searchKey: debouncedSearch, zoneId });
	}, [debouncedSearch, zoneId, loadJobs]);

	const handlePageChange = (newPage: number) => {
		loadJobs(newPage, { searchKey: debouncedSearch, zoneId });
	};

	const onFilterSubmit = (data: FilterValues) => {
		loadJobs(0, data);
	};

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onFilterSubmit)}
						className='flex flex-col md:flex-row gap-4 items-center p-4 border rounded-lg bg-card sticky top-20 z-10 glassmorphism'
					>
						<div className='relative w-full flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
							<Input
								{...form.register('searchKey')}
								placeholder='Search by job title or organization...'
								className='w-full h-12 pl-12 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent'
							/>
						</div>
						<div className='w-full md:w-52'>
							<FormSelect
								control={form.control}
								name='zoneId'
								options={[{ id: 'all', nameEn: 'All Zones' }, ...zones]}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.nameEn}
								value={zoneId}
								onValueChange={(value) => form.setValue('zoneId', value || 'all')}
							/>
						</div>
						<div className='flex items-center gap-2'>
							<Button
								type='button'
								variant={viewMode === 'grid' ? 'default' : 'outline'}
								size='icon'
								onClick={() => setViewMode('grid')}
							>
								<Grid className='h-5 w-5' />
							</Button>
							<Button
								type='button'
								variant={viewMode === 'list' ? 'default' : 'outline'}
								size='icon'
								onClick={() => setViewMode('list')}
							>
								<List className='h-5 w-5' />
							</Button>
						</div>
					</form>
				</Form>
			)}
			<div className='flex items-center justify-between'>
				<p className='text-sm font-medium text-muted-foreground'>
					Showing <span className='font-bold text-foreground'>{meta.totalRecords || 0}</span> jobs
				</p>
			</div>
			{isLoading ? (
				<div
					className={cn(
						'grid gap-6',
						viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
					)}
				>
					{[...Array(meta.limit)].map((_, i) => (
						<Skeleton key={i} className={cn(viewMode === 'grid' ? 'h-64' : 'h-28')} />
					))}
				</div>
			) : jobs.length > 0 ? (
				<div
					className={cn(
						'grid gap-6',
						viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
					)}
				>
					{jobs.map((job) => (
						<JobCard key={job.id} job={job} viewMode={viewMode} />
					))}
				</div>
			) : (
				<Card className='flex flex-col items-center justify-center py-20 text-center'>
					<Search className='h-16 w-16 text-muted-foreground/50 mb-4' />
					<h3 className='text-xl font-semibold'>No Jobs Found</h3>
					<p className='text-muted-foreground'>Try adjusting your search filters.</p>
				</Card>
			)}

			{isPaginated && meta && meta.totalRecords && meta.totalRecords > 0 ? (
				<div className='flex justify-center pt-8'>
					<Pagination meta={meta} onPageChange={handlePageChange} noun='job' />
				</div>
			) : null}
		</div>
	);
}

const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = React.useState(value);
	React.useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);
	return debouncedValue;
};
