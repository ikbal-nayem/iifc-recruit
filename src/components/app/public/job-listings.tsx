
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInDays, endOfDay, format, isPast, parseISO } from 'date-fns';
import { Briefcase, Calendar, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { getLocaleSync, t } from '@/lib/i18n-server';
import { ICircular } from '@/interfaces/job.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { CircularService } from '@/services/api/circular.service';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes.constant';
import { cn } from '@/lib/utils';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Form } from '../../ui/form';
import { FormInput } from '../../ui/form-input';
import { Pagination } from '../../ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

const filterSchema = z.object({
	searchKey: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

export function JobListings({ isPaginated = true, showFilters = true, itemLimit = 10 }: JobListingsProps) {
	const searchParams = useSearchParams();
	const [data, setData] = useState<ICircular[]>([]);
	const [meta, setMeta] = useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = useState(true);

	const form = useForm<FilterFormValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			searchKey: searchParams.get('query') || '',
		},
	});

	const debouncedSearch = useDebounce(form.watch('searchKey'), 500);

	const loadData = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { searchKey: search },
					meta: { page: page, limit: meta.limit },
				};
				const response = await CircularService.search(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast.error({
					description: error.message || 'Failed to load job circulars.',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	useEffect(() => {
		loadData(0, debouncedSearch);
	}, [debouncedSearch, loadData]);

	const handlePageChange = (newPage: number) => {
		loadData(newPage, debouncedSearch);
	};

	const locale = getLocaleSync();

	const renderJobCard = (job: ICircular) => {
		const deadline = parseISO(job.circularEndDate);
		const isExpired = isPast(endOfDay(deadline));
		const daysLeft = differenceInDays(endOfDay(deadline), new Date());

		let deadlineBadgeVariant: 'danger' | 'warning' | 'secondary' = 'secondary';
		if (isExpired) {
			deadlineBadgeVariant = 'danger';
		} else if (daysLeft <= 7) {
			deadlineBadgeVariant = 'warning';
		}

		return (
			<Card key={job.id} className='glassmorphism card-hover'>
				<CardHeader>
					<CardTitle className='font-headline text-xl group-hover:text-primary transition-colors'>
						<Link href={ROUTES.JOB_SEEKER.JOB_DETAILS(job.id)}>{job.postNameEn}</Link>
					</CardTitle>
					<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-1'>
						<span className='flex items-center gap-2'>
							<Briefcase className='h-4 w-4' /> {job.clientOrganizationNameEn}
						</span>
						{job.outsourcingZoneNameEn && (
							<span className='flex items-center gap-2'>
								<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
							</span>
						)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex items-center gap-4 text-sm'>
						<Badge variant={deadlineBadgeVariant}>
							<Calendar className='mr-1.5 h-4 w-4' />
							{t(locale, 'jobs.deadline')}: {format(deadline, 'dd MMM, yyyy')}
						</Badge>
					</div>
				</CardContent>
			</Card>
		);
	};

	const renderSkeleton = (key: number) => (
		<Card key={key} className='glassmorphism'>
			<CardHeader>
				<Skeleton className='h-6 w-3/4' />
				<Skeleton className='h-4 w-1/2 mt-2' />
			</CardHeader>
			<CardContent>
				<Skeleton className='h-6 w-1/3' />
			</CardContent>
		</Card>
	);

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Card className='glassmorphism p-4 md:p-6'>
					<Form {...form}>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								loadData(0, form.getValues('searchKey') || '');
							}}
							className='flex flex-col md:flex-row gap-4'
						>
							<div className='flex-1'>
								<FormInput
									control={form.control}
									name='searchKey'
									placeholder={t(locale, 'jobs.jobTitle') + ', ' + t(locale, 'jobs.category') + '...'}
									startIcon={<Search className='h-4 w-4 text-muted-foreground' />}
								/>
							</div>

							<Button type='submit' className='w-full md:w-auto'>
								{isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Search className='mr-2 h-4 w-4' />}
								{t(locale, 'common.search')}
							</Button>
						</form>
					</Form>
				</Card>
			)}

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{isLoading ? (
					[...Array(itemLimit)].map((_, i) => renderSkeleton(i))
				) : data.length > 0 ? (
					data.map(renderJobCard)
				) : (
					<div className='md:col-span-2 lg:col-span-3 text-center py-16'>
						<p className='text-muted-foreground'>{t(locale, 'jobs.noJobsFound')}</p>
					</div>
				)}
			</div>

			{isPaginated && meta && meta.totalRecords && meta.totalRecords > 0 ? (
				<div className='flex justify-center'>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={'Job'} />
				</div>
			) : null}
		</div>
	);
}
