
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { CircularService } from '@/services/api/circular.service';
import { format, parseISO } from 'date-fns';
import { Briefcase, Building, Clock, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { JobDetailClient } from '../jobseeker/job-detail-client';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit = 6,
}: JobListingsProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { toast } = useToast();

	const [jobs, setJobs] = useState<ICircular[]>([]);
	const [meta, setMeta] = useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = useState(true);

	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				params.set(name, value);
			} else {
				params.delete(name);
			}
			return params.toString();
		},
		[searchParams]
	);

	const loadJobs = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { searchKey: search },
					meta: { page: page, limit: meta.limit },
				};
				const response = await CircularService.search(payload);
				setJobs(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast({
					title: 'Error',
					description: error.message || 'Failed to load jobs.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		const page = parseInt(searchParams.get('page') || '0', 10);
		const query = searchParams.get('q') || '';
		loadJobs(page, query);
	}, [searchParams, loadJobs]);

	useEffect(() => {
		const newPath = `${window.location.pathname}?${createQueryString('q', debouncedSearch)}`;
		router.push(newPath, { scroll: false });
	}, [debouncedSearch, router, createQueryString]);

	const handlePageChange = (newPage: number) => {
		const newPath = `${window.location.pathname}?${createQueryString('page', newPage.toString())}`;
		router.push(newPath, { scroll: false });
	};

	const renderJobCard = (job: ICircular) => {
		return (
			<Card key={job.id} className='group glassmorphism card-hover'>
				<CardHeader>
					<CardTitle className='font-headline text-xl group-hover:text-primary transition-colors'>
						<Link href={`/jobs/${job.id}?${createQueryString('page', meta.page.toString())}`}>
							{job.postNameEn}
						</Link>
					</CardTitle>
					<CardDescription className='flex flex-col gap-2 pt-2'>
						<span className='flex items-center gap-2'>
							<Building className='h-4 w-4' /> {job.clientOrganizationNameEn}
						</span>
						{job.outsourcingZoneNameEn && (
							<span className='flex items-center gap-2'>
								<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
							</span>
						)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground line-clamp-3'>{job.jobDescription}</p>
					<div className='mt-4 flex flex-wrap gap-2'>
						<Badge variant='secondary' className='flex items-center gap-1.5'>
							<Briefcase className='h-3 w-3' />
							{job.outsourcing ? 'Outsourcing' : 'Permanent'}
						</Badge>
						<Badge variant='secondary' className='flex items-center gap-1.5'>
							<Clock className='h-3 w-3' />
							Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
						</Badge>
					</div>
				</CardContent>
			</Card>
		);
	};

	return (
		<div className='space-y-8'>
			{showFilters && (
				<div className='flex justify-center'>
					<div className='relative w-full max-w-lg'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
						<Input
							type='text'
							placeholder='Search by job title, company, or keywords...'
							className='w-full h-12 pl-12 text-base'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
			)}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{isLoading
					? [...Array(itemLimit)].map((_, i) => <Skeleton key={i} className='h-72 w-full' />)
					: jobs.map(renderJobCard)}
			</div>
			{!isLoading && jobs.length === 0 && (
				<div className='text-center py-16 text-muted-foreground col-span-full'>
					<p>No job openings found matching your criteria.</p>
				</div>
			)}
			{isPaginated && meta && meta.totalRecords && meta.totalRecords > 0 ? (
				<div className='flex justify-center'>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='job' />
				</div>
			) : null}
		</div>
	);
}
