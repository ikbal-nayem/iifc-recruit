
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormProvider, useForm } from 'react-hook-form';

import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { Pagination } from '@/components/ui/pagination';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { useDebounce } from '@/hooks/use-debounce';
import { useTranslations } from '@/hooks/use-translations';
import { IApiRequest, IMeta, IObject } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { CircularService } from '@/services/api/circular.service';
import { getOutsourcingCategoriesAsync } from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { endOfDay, format, isPast, parseISO } from 'date-fns';
import { Briefcase, Calendar, DollarSign, Eye, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { Skeleton } from '@/components/ui/skeleton';

const filterSchema = z.object({
	searchKey: z.string().optional(),
	outsourcingCategoryId: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const filterTranslations = {
	en: {
		searchPlaceholder: 'Search by job title, company, or keywords...',
		categoryPlaceholder: 'Filter by category...',
		filterButton: 'Filter',
		clearButton: 'Clear',
	},
	bn: {
		searchPlaceholder: 'চাকরির শিরোনাম, কোম্পানি বা কীওয়ার্ড দ্বারা অনুসন্ধান করুন...',
		categoryPlaceholder: 'বিভাগ দ্বারা ফিল্টার করুন...',
		filterButton: 'ফিল্টার',
		clearButton: 'মুছুন',
	},
};

const jobListingsTranslations = {
	en: {
		posted: 'Posted',
		deadline: 'Deadline',
		noJobs: 'No job openings match your criteria at the moment.',
	},
	bn: {
		posted: 'প্রকাশিত',
		deadline: 'শেষ তারিখ',
		noJobs: 'এই মুহূর্তে আপনার মানদণ্ডের সাথে মিলে এমন কোনো চাকরির সুযোগ নেই।',
	},
};

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

export function JobListings({ isPaginated = true, showFilters = true, itemLimit = 9 }: JobListingsProps) {
	const t = useTranslations(jobListingsTranslations);
	const tFilter = useTranslations(filterTranslations);
	const { isAuthenticated } = useAuth();
	const [jobs, setJobs] = useState<ICircular[]>([]);
	const [meta, setMeta] = useState<IMeta>({ limit: itemLimit, page: 0 });
	const [isLoading, setIsLoading] = useState(true);
	const [categories, setCategories] = useState<ICommonMasterData[]>([]);

	const filterForm = useForm<FilterFormValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			searchKey: '',
			outsourcingCategoryId: 'all',
		},
	});

	const searchKey = filterForm.watch('searchKey');
	const categoryId = filterForm.watch('outsourcingCategoryId');
	const debouncedSearch = useDebounce(searchKey, 500);

	const fetchJobs = useCallback(
		async (page: number, filters: Partial<FilterFormValues>) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					meta: { page, limit: itemLimit },
					body: {
						searchKey: filters.searchKey,
						...(filters.outsourcingCategoryId &&
							filters.outsourcingCategoryId !== 'all' && { outsourcingCategoryId: filters.outsourcingCategoryId }),
					},
				};
				const res = await CircularService.search(payload);
				setJobs(res.body || []);
				setMeta(res.meta);
			} catch (error) {
				console.error('Failed to fetch jobs', error);
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit]
	);

	useEffect(() => {
		fetchJobs(0, { searchKey: debouncedSearch, outsourcingCategoryId: categoryId });
	}, [debouncedSearch, categoryId, fetchJobs]);

	useEffect(() => {
		if (showFilters) {
			getOutsourcingCategoriesAsync('', (data) => setCategories(data));
		}
	}, [showFilters]);

	const handlePageChange = (newPage: number) => {
		fetchJobs(newPage, filterForm.getValues());
	};

	const clearFilters = () => {
		filterForm.reset({ searchKey: '', outsourcingCategoryId: 'all' });
	};

	const JobCard = ({ job }: { job: ICircular }) => {
		const isExpired = isPast(endOfDay(parseISO(job.circularEndDate)));

		return (
			<Card className='glassmorphism card-hover flex flex-col'>
				<CardHeader>
					<CardTitle className='font-headline text-lg group-hover:text-primary'>{job.postNameBn}</CardTitle>
					<CardDescription className='flex items-center gap-2 pt-1'>
						<Briefcase className='h-4 w-4' /> {job.clientOrganizationNameBn}
					</CardDescription>
				</CardHeader>
				<CardContent className='flex-grow space-y-3'>
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<MapPin className='h-4 w-4' />
						<span>{job.outsourcingZoneNameBn || 'Any Location'}</span>
					</div>
					{(job.salaryFrom || job.salaryTo) && (
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<DollarSign className='h-4 w-4' />
							<span>
								{job.salaryFrom?.toLocaleString()}
								{job.salaryTo ? ` - ${job.salaryTo?.toLocaleString()}` : ''}
							</span>
						</div>
					)}
					<div className='flex items-center gap-2 text-sm text-muted-foreground'>
						<Calendar className='h-4 w-4' />
						<span>
							{t.deadline}: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
						</span>
					</div>
					{isExpired && (
						<Badge variant='danger' className='mt-2'>
							Deadline Passed
						</Badge>
					)}
				</CardContent>
				<CardFooter>
					<Button asChild className='w-full' variant={isExpired ? 'outline' : 'default'}>
						<Link href={isAuthenticated ? ROUTES.JOB_SEEKER.JOB_DETAILS(job.id) : `/jobs/${job.id}`}>
							<Eye className='mr-2 h-4 w-4' />
							{t.view}
						</Link>
					</Button>
				</CardFooter>
			</Card>
		);
	};

	const SkeletonCard = () => (
		<Card className='flex flex-col'>
			<CardHeader>
				<Skeleton className='h-6 w-3/4' />
				<Skeleton className='h-4 w-1/2 mt-2' />
			</CardHeader>
			<CardContent className='flex-grow space-y-3'>
				<Skeleton className='h-4 w-full' />
				<Skeleton className='h-4 w-2/3' />
			</CardContent>
			<CardFooter>
				<Skeleton className='h-10 w-full' />
			</CardFooter>
		</Card>
	);

	return (
		<div className='space-y-8'>
			{showFilters && (
				<FormProvider {...filterForm}>
					<form className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end'>
						<div className='md:col-span-2 lg:col-span-2'>
							<FormAutocomplete
								name='searchKey'
								label='Search'
								placeholder={tFilter.searchPlaceholder}
								control={filterForm.control}
								onInputChange={(value) => filterForm.setValue('searchKey', value)}
								loadOptions={(query, callback) => {
									const filtered = jobs
										.filter((job) => job.postNameEn.toLowerCase().includes(query.toLowerCase()))
										.slice(0, 10);
									callback(filtered);
								}}
								getOptionLabel={(option) => option.postNameEn}
								getOptionValue={(option) => option.id}
							/>
						</div>
						<div className='w-full'>
							<FormAutocomplete
								name='outsourcingCategoryId'
								label='Category'
								placeholder={tFilter.categoryPlaceholder}
								control={filterForm.control}
								options={[{ id: 'all', nameEn: 'All Categories' }, ...categories]}
								getOptionValue={(opt) => opt.id!}
								getOptionLabel={(opt) => opt.nameEn}
							/>
						</div>
						<div className='flex gap-2'>
							<Button type='button' onClick={clearFilters} variant='outline' className='w-full'>
								{tFilter.clearButton}
							</Button>
						</div>
					</form>
				</FormProvider>
			)}

			<div className='relative'>
				{isLoading && jobs.length > 0 && (
					<div className='absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center z-10'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
					</div>
				)}
				{isLoading && jobs.length === 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[...Array(itemLimit)].map((_, i) => (
							<SkeletonCard key={i} />
						))}
					</div>
				) : jobs.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{jobs.map((job) => (
							<JobCard key={job.id} job={job} />
						))}
					</div>
				) : (
					<div className='text-center py-16'>
						<p className='text-muted-foreground'>{t.noJobs}</p>
					</div>
				)}
			</div>
			{isPaginated && meta && meta.totalRecords! > itemLimit && (
				<div className='flex justify-center'>
					<Pagination meta={meta} onPageChange={handlePageChange} noun='Job' />
				</div>
			)}
		</div>
	);
}

