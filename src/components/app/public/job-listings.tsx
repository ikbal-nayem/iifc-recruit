
'use client';

import { ICircular } from '@/interfaces/job.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import * as React from 'react';
import { JobCard } from './job-card';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Form, useForm } from 'react-hook-form';
import { IOutsourcingCategory } from '@/interfaces/master-data.interface';
import { useSearchParams } from 'next/navigation';
import { FormSelect } from '@/components/ui/form-select';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

const initMeta: IMeta = { page: 0, limit: 12, totalRecords: 0 };

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit = 12,
}: JobListingsProps) {
	const searchParams = useSearchParams();
	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = React.useState(true);
	const { toast } = useToast();
	const form = useForm();

	const [searchQuery, setSearchQuery] = React.useState(searchParams.get('q') || '');
	const [categoryFilter, setCategoryFilter] = React.useState(searchParams.get('category') || 'all');
	const [outsourcingCategories, setOutsourcingCategories] = React.useState<IOutsourcingCategory[]>([]);

	React.useEffect(() => {
		async function fetchFilters() {
			try {
				const [categoriesRes] = await Promise.all([MasterDataService.outsourcingCategory.get()]);
				setOutsourcingCategories(categoriesRes.body);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Could not load filter options.',
					variant: 'danger',
				});
			}
		}
		if (showFilters) {
			fetchFilters();
		}
	}, [showFilters, toast]);

	const searchJobs = React.useCallback(
		async (page: number, search: string, categoryId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						searchKey: search,
						...(categoryId !== 'all' && { outsourcingCategoryId: categoryId }),
					},
					meta: { page: page, limit: itemLimit },
				};
				const response = await CircularService.search(payload);
				setJobs(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to search jobs', error);
				toast({
					title: 'Error',
					description: 'Failed to load job listings.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit, toast]
	);

	React.useEffect(() => {
		searchJobs(0, searchQuery, categoryFilter);
	}, [searchQuery, categoryFilter, searchJobs]);

	const handlePageChange = (newPage: number) => {
		searchJobs(newPage, searchQuery, categoryFilter);
	};

	const buildSearchQuery = () => {
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (categoryFilter !== 'all') params.set('category', categoryFilter);
		return params.toString();
	};

	const FilterBar = () => (
		<Form {...form}>
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
				<div className='w-full sm:w-52'>
					<FormSelect
						name='categoryFilter'
						control={form.control}
						placeholder='All Categories'
						options={[{ id: 'all', nameEn: 'All Categories' }, ...outsourcingCategories]}
						value={categoryFilter}
						onValueChange={(value) => setCategoryFilter(value || 'all')}
						getOptionValue={(option) => option.id}
						getOptionLabel={(option) => option.nameEn}
						className='h-12'
					/>
				</div>
			</div>
		</Form>
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
							<JobCard key={job.id} job={job} queryParams={buildSearchQuery()} />
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
