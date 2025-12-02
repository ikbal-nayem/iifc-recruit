
'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { cn } from '@/lib/utils';
import { CircularService } from '@/services/api/circular.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { endOfDay, format, isPast, parseISO } from 'date-fns';
import { Briefcase, Calendar, DollarSign, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '../../ui/badge';
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

const initMeta: IMeta = { page: 0, limit: 10 };

function CircularCard({ job }: { job: ICircular }) {
	const isExpired = isPast(endOfDay(parseISO(job.circularEndDate)));

	return (
		<Card className='glassmorphism card-hover'>
			<CardHeader>
				<CardTitle className='font-headline text-xl group-hover:text-primary transition-colors'>
					{job.postNameEn}
				</CardTitle>
				<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-1 pt-2'>
					<span className='flex items-center gap-2'>
						<Briefcase className='h-4 w-4' /> {job.clientOrganizationNameEn}
					</span>
					{job.outsourcingZoneNameEn && (
						<span className='flex items-center gap-2'>
							<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
						</span>
					)}
					{(job.salaryFrom || job.salaryTo) && (
						<span className='flex items-center gap-2'>
							<DollarSign className='h-4 w-4' />
							{job.salaryFrom?.toLocaleString()}
							{job.salaryTo ? ` - ${job.salaryTo?.toLocaleString()}` : ''}
						</span>
					)}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex items-center gap-2 text-sm'>
					<Badge variant={isExpired ? 'danger' : 'secondary'}>
						<Calendar className='mr-1.5 h-3 w-3' />
						Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit = 9,
}: {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const form = useForm<FilterFormValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			searchKey: searchParams.get('searchKey') || '',
		},
	});
	const { watch } = form;
	const debouncedSearch = useDebounce(watch('searchKey') || '', 500);

	const [jobs, setJobs] = useState<ICircular[]>([]);
	const [meta, setMeta] = useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = useState(true);

	const loadJobs = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					meta: { page: page, limit: itemLimit },
					body: { searchKey: search },
				};
				const response = await CircularService.search(payload);
				setJobs(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				console.error('Failed to load jobs', error);
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit]
	);

	useEffect(() => {
		const page = parseInt(searchParams.get('page') || '0', 10);
		loadJobs(page, debouncedSearch);

		// Update URL without re-rendering
		const newParams = new URLSearchParams(searchParams.toString());
		if (debouncedSearch) {
			newParams.set('searchKey', debouncedSearch);
		} else {
			newParams.delete('searchKey');
		}
		const newUrl = `${window.location.pathname}?${newParams.toString()}`;
		window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
	}, [debouncedSearch, searchParams, loadJobs]);

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', newPage.toString());
		router.push(`?${params.toString()}`);
	};

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Form {...form}>
					<form
						className='flex flex-col sm:flex-row items-center gap-4'
						onSubmit={(e) => e.preventDefault()}
					>
						<div className='relative w-full flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
							<FormInput
								control={form.control}
								name='searchKey'
								placeholder='Search by job title, company, or keywords...'
								className='pl-12 h-12'
							/>
						</div>
					</form>
				</Form>
			)}

			<div
				className={cn(
					'grid grid-cols-1 md:grid-cols-2 gap-6',
					isLoading && 'relative min-h-[500px]',
					showFilters && 'lg:grid-cols-3'
				)}
			>
				{isLoading && (
					<div className='absolute inset-0 bg-background/50 flex items-center justify-center'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
					</div>
				)}
				{!isLoading && jobs.length === 0 ? (
					<div className='col-span-full text-center py-16'>
						<h3 className='text-xl font-semibold'>No Jobs Found</h3>
						<p className='text-muted-foreground'>Try adjusting your search or filters.</p>
					</div>
				) : (
					jobs.map((job) => (
						<Link key={job.id} href={`/jobs/${job.id}?${searchParams.toString()}`} className='group'>
							<CircularCard job={job} />
						</Link>
					))
				)}
				{isLoading &&
					[...Array(itemLimit)].map((_, i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className='h-6 w-3/4' />
								<Skeleton className='h-4 w-1/2 mt-2' />
							</CardHeader>
							<CardContent>
								<Skeleton className='h-5 w-24' />
							</CardContent>
						</Card>
					))}
			</div>

			{isPaginated && meta && meta.totalRecords && meta.totalRecords > 0 && (
				<div className='flex items-center justify-center pt-8'>
					<Pagination meta={meta} onPageChange={handlePageChange} noun='Job' />
				</div>
			)}
		</div>
	);
}
