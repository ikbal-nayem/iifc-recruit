
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormSelect } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { CircularService } from '@/services/api/circular.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { cn } from '@/lib/utils';
import { LayoutGrid, List, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { JobCard } from './job-card';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

type FilterFormValues = {
	searchKey: string;
	categoryId: string;
};

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit = 9,
}: JobListingsProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ page: 0, limit: itemLimit });
	const [isLoading, setIsLoading] = React.useState(true);
	const [categories, setCategories] = React.useState<ICommonMasterData[]>([]);
	const [view, setView] = React.useState<'grid' | 'list'>('grid');

	const form = useForm<FilterFormValues>({
		defaultValues: {
			searchKey: searchParams.get('searchKey') || '',
			categoryId: searchParams.get('categoryId') || 'all',
		},
	});

	const searchKey = form.watch('searchKey');
	const categoryId = form.watch('categoryId');
	const debouncedSearchKey = useDebounce(searchKey, 500);

	const loadData = React.useCallback(
		async (page: number, search: string, catId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						searchKey: search,
						...(catId !== 'all' && { categoryId: catId }),
					},
					meta: { page: page, limit: itemLimit },
				};
				const [jobsRes, categoriesRes] = await Promise.allSettled([
					CircularService.search(payload),
					MasterDataService.outsourcingCategory.get(),
				]);

				if (jobsRes.status === 'fulfilled') {
					setJobs(jobsRes.value.body);
					setMeta(jobsRes.value.meta);
				}

				if (categoriesRes.status === 'fulfilled') {
					setCategories(categoriesRes.value.body);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit]
	);

	React.useEffect(() => {
		const page = parseInt(searchParams.get('page') || '0', 10);
		loadData(page, debouncedSearchKey, categoryId);

		const params = new URLSearchParams(searchParams.toString());
		if (debouncedSearchKey) {
			params.set('searchKey', debouncedSearchKey);
		} else {
			params.delete('searchKey');
		}
		if (categoryId && categoryId !== 'all') {
			params.set('categoryId', categoryId);
		} else {
			params.delete('categoryId');
		}
		params.set('page', '0'); // Reset page on filter change
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	}, [debouncedSearchKey, categoryId]);

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', newPage.toString());
		router.push(`${pathname}?${params.toString()}`, { scroll: false });
		loadData(newPage, debouncedSearchKey, categoryId);
	};

	const renderSkeletons = () => (
		<div
			className={cn(
				'grid gap-6',
				view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
			)}
		>
			{[...Array(itemLimit)].map((_, i) => (
				<Card key={i} className='p-4'>
					<div className='flex gap-4'>
						<Skeleton className='h-12 w-12 rounded-lg' />
						<div className='flex-1 space-y-2'>
							<Skeleton className='h-5 w-3/4' />
							<Skeleton className='h-4 w-1/2' />
						</div>
					</div>
					<div className='mt-4 space-y-2'>
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-5/6' />
					</div>
					<div className='mt-4 flex justify-between items-center'>
						<Skeleton className='h-4 w-24' />
						<Skeleton className='h-8 w-20' />
					</div>
				</Card>
			))}
		</div>
	);

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Card className='p-4 sm:p-6 glassmorphism'>
					<Form {...form}>
						<form className='flex flex-col sm:flex-row items-center gap-4'>
							<div className='relative w-full sm:flex-1'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									{...form.register('searchKey')}
									placeholder='Search by job title or organization...'
									className='pl-10 h-11 bg-background'
								/>
							</div>
							<div className='w-full sm:w-auto sm:min-w-48'>
								<FormSelect
									control={form.control}
									name='categoryId'
									options={[{ id: 'all', nameEn: 'All Categories' }, ...categories]}
									getOptionValue={(option) => option.id!}
									getOptionLabel={(option) => option.nameEn}
									className='h-11 bg-background'
								/>
							</div>
							<div className='hidden sm:flex items-center gap-2'>
								<Button
									variant={view === 'grid' ? 'default' : 'outline'}
									size='icon'
									onClick={() => setView('grid')}
									className='h-11 w-11'
								>
									<LayoutGrid className='h-5 w-5' />
								</Button>
								<Button
									variant={view === 'list' ? 'default' : 'outline'}
									size='icon'
									onClick={() => setView('list')}
									className='h-11 w-11'
								>
									<List className='h-5 w-5' />
								</Button>
							</div>
						</form>
					</Form>
				</Card>
			)}

			{isLoading ? (
				renderSkeletons()
			) : jobs.length > 0 ? (
				<div
					className={cn(
						'grid gap-6',
						view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
					)}
				>
					{jobs.map((job) => (
						<JobCard key={job.id} job={job} view={view} />
					))}
				</div>
			) : (
				<div className='text-center py-16 text-muted-foreground'>
					<h3 className='text-xl font-semibold'>No Jobs Found</h3>
					<p>Try adjusting your search filters to find what you're looking for.</p>
				</div>
			)}
			{isPaginated && meta && meta.totalRecords && meta.totalRecords > 0 && !isLoading && (
				<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='job' />
			)}
		</div>
	);
}
