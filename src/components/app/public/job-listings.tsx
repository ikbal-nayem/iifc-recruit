
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { useAuth } from '@/contexts/auth-context';
import { useDebounce } from '@/hooks/use-debounce';
import { useTranslations } from '@/hooks/use-translations';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { CircularService } from '@/services/api/circular.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInDays, endOfDay, format, isPast, parseISO } from 'date-fns';
import { ArrowRight, Briefcase, Calendar, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const filterSchema = z.object({
	searchKey: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const jobListingsTranslations = {
	en: {
		experience: 'Experience',
		applicants: 'Applicants',
		viewDetails: 'View Details',
		noJobs: 'No job openings found matching your criteria.',
	},
	bn: {
		experience: 'অভিজ্ঞতা',
		applicants: 'আবেদনকারী',
		viewDetails: 'বিবরণ দেখুন',
		noJobs: 'আপনার মানদণ্ড অনুযায়ী কোনো চাকরির সুযোগ পাওয়া যায়নি।',
	},
};

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit = 6,
}: {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}) {
	const t = useTranslations(jobListingsTranslations);
	const searchParams = useSearchParams();
	const { isAuthenticated } = useAuth();
	const [jobs, setJobs] = useState<ICircular[]>([]);
	const [meta, setMeta] = useState<IMeta>({ page: 0, limit: itemLimit });
	const [isLoading, setIsLoading] = useState(true);

	const form = useForm<FilterFormValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: { searchKey: searchParams.get('query') || '' },
	});

	const searchKey = form.watch('searchKey');
	const debouncedSearch = useDebounce(searchKey, 300);

	const loadJobs = useCallback(
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
				console.error('Failed to load jobs', error);
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit]
	);

	useEffect(() => {
		loadJobs(0, debouncedSearch);
	}, [debouncedSearch, loadJobs]);

	const handlePageChange = (newPage: number) => {
		loadJobs(newPage, debouncedSearch);
	};

	const renderJobCard = (job: ICircular) => {
		const deadline = parseISO(job.circularEndDate);
		const isExpired = isPast(endOfDay(deadline));
		const daysUntilDeadline = differenceInDays(endOfDay(deadline), new Date());

		return (
			<Card key={job.id} className='group glassmorphism card-hover'>
				<CardHeader>
					<div className='flex justify-between items-start'>
						<CardTitle className='font-headline text-xl group-hover:text-primary transition-colors'>
							{job.postNameEn}
						</CardTitle>
						<Badge variant={isExpired ? 'danger' : daysUntilDeadline <= 7 ? 'warning' : 'secondary'}>
							<Calendar className='mr-2 h-3 w-3' />
							{format(deadline, 'dd MMM, yyyy')}
						</Badge>
					</div>
					<CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-2'>
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
					<p className='text-sm text-muted-foreground line-clamp-2'>{job.jobDescription}</p>
				</CardContent>
				<CardFooter>
					<Button asChild variant='link' className='p-0 h-auto group'>
						<Link
							href={
								isAuthenticated
									? ROUTES.JOB_SEEKER.JOB_DETAILS(job.id)
									: `/jobs/${job.id}?${searchParams.toString()}`
							}
						>
							{t.viewDetails} <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
						</Link>
					</Button>
				</CardFooter>
			</Card>
		);
	};

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Form {...form}>
					<form className='max-w-md mx-auto'>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
							<FormInput
								control={form.control}
								name='searchKey'
								placeholder='Search by job title, organization...'
								className='pl-10 h-12 text-base'
							/>
						</div>
					</form>
				</Form>
			)}

			{isLoading ? (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{[...Array(itemLimit)].map((_, i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className='h-6 w-3/4' />
								<Skeleton className='h-4 w-1/2 mt-2' />
							</CardHeader>
							<CardContent>
								<Skeleton className='h-10 w-full' />
							</CardContent>
							<CardFooter>
								<Skeleton className='h-5 w-24' />
							</CardFooter>
						</Card>
					))}
				</div>
			) : jobs.length > 0 ? (
				<>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>{jobs.map(renderJobCard)}</div>
					{isPaginated && meta.totalRecords && meta.totalRecords > 0 && (
						<Pagination meta={meta} onPageChange={handlePageChange} noun='job' />
					)}
				</>
			) : (
				<div className='text-center py-16'>
					<p className='text-muted-foreground'>{t.noJobs}</p>
				</div>
			)}
		</div>
	);
}
