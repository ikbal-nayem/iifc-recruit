
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { IOutsourcingZone } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { CircularService } from '@/services/api/circular.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { differenceInDays, format, isPast, parseISO } from 'date-fns';
import { Briefcase, Calendar, Clock, DollarSign, Grid2X2, List, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Form, useForm } from 'react-hook-form';
import { FormSelect } from '@/components/ui/form-select';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

const initMeta: IMeta = { page: 0, limit: 9, totalRecords: 0 };

type FilterFormValues = {
	search: string;
	zone: string;
};

export function JobListings({ isPaginated = true, showFilters = true, itemLimit }: JobListingsProps) {
	const searchParams = useSearchParams();
	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit || initMeta.limit });
	const [isLoading, setIsLoading] = React.useState(true);
	const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
	const [zones, setZones] = React.useState<IOutsourcingZone[]>([]);
	const { toast } = useToast();

	const form = useForm<FilterFormValues>({
		defaultValues: {
			search: '',
			zone: 'all',
		},
	});

	const search = form.watch('search');
	const zone = form.watch('zone');
	const debouncedSearch = useDebounce(search, 500);

	React.useEffect(() => {
		MasterDataService.outsourcingZone
			.get()
			.then((res) => {
				setZones([{ id: 'all', nameEn: 'All Zones', nameBn: '', active: true }, ...res.body]);
			})
			.catch(() => toast.error({ description: 'Failed to load zones.' }));
	}, [toast]);

	const fetchJobs = React.useCallback(
		async (page: number) => {
			setIsLoading(true);
			try {
				const response = await CircularService.search({
					body: {
						searchKey: debouncedSearch,
						...(zone !== 'all' && { outsourcingZoneId: zone }),
					},
					meta: { page: page, limit: meta.limit },
				});
				setJobs(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast.error({ description: error.message || 'Failed to fetch jobs.' });
			} finally {
				setIsLoading(false);
			}
		},
		[debouncedSearch, zone, meta.limit, toast]
	);

	React.useEffect(() => {
		fetchJobs(0);
	}, [fetchJobs]);

	const handlePageChange = (newPage: number) => {
		fetchJobs(newPage);
	};

	const JobCard = ({ job }: { job: ICircular }) => {
		const deadline = parseISO(job.circularEndDate);
		const daysLeft = differenceInDays(deadline, new Date());
		const isExpired = isPast(deadline);
		const deadlineColorClass = isExpired
			? 'border-gray-400 text-gray-400'
			: daysLeft <= 3
			? 'border-danger/80 text-danger animate-pulse-subtle'
			: daysLeft <= 7
			? 'border-warning/80 text-warning animate-pulse-subtle'
			: '';

		const cardContent = (
			<>
				<div className='flex items-start justify-between'>
					<h3 className='font-bold text-lg group-hover:text-primary transition-colors'>{job.postNameEn}</h3>
					<div
						className={cn('text-xs font-semibold flex items-center gap-1.5 border rounded-full px-2 py-1', deadlineColorClass)}
					>
						<Calendar className='h-3.5 w-3.5' />
						<span>
							{isExpired ? 'Closed' : daysLeft < 0 ? 'Closing Today' : `${daysLeft} days left`}
						</span>
					</div>
				</div>
				<p className='text-sm text-muted-foreground flex items-center gap-2'>
					<Briefcase className='h-4 w-4' /> {job.clientOrganizationNameEn}
				</p>
				<div className='flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2'>
					{job.outsourcingZoneNameEn && (
						<span className='flex items-center gap-2'>
							<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
						</span>
					)}
					<span className='flex items-center gap-2'>
						<Clock className='h-4 w-4' /> {job.outsourcing ? 'Outsourcing' : 'Permanent'}
					</span>
					{(job.salaryFrom || job.salaryTo) && (
						<span className='flex items-center gap-2'>
							<DollarSign className='h-4 w-4' /> {job.salaryFrom} - {job.salaryTo}
						</span>
					)}
				</div>
				<div className='flex-grow' />
				<div className='flex justify-between items-center pt-4'>
					<Badge variant='outline'>{job.postNameEn}</Badge>
					<p className='text-xs text-muted-foreground'>
						Posted: {format(parseISO(job.circularPublishDate), 'dd MMM, yyyy')}
					</p>
				</div>
			</>
		);

		return (
			<Link
				href={`/jobs/${job.id}?${searchParams.toString()}`}
				className='group block'
				aria-label={`View details for ${job.postNameEn}`}
			>
				{viewMode === 'grid' ? (
					<Card className='h-full flex flex-col p-4 space-y-3 glassmorphism card-hover'>
						{cardContent}
					</Card>
				) : (
					<Card className='flex flex-col sm:flex-row items-stretch p-4 space-y-3 sm:space-y-0 sm:space-x-4 glassmorphism card-hover'>
						<div className='flex flex-col flex-1'>{cardContent}</div>
					</Card>
				)}
			</Link>
		);
	};

	return (
		<div className='space-y-6'>
			{showFilters && (
				<Form {...form}>
					<div className='p-4 border rounded-lg bg-background shadow-sm space-y-4'>
						<div className='flex flex-col md:flex-row gap-4'>
							<div className='relative flex-grow'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
								<Input
									{...form.register('search')}
									placeholder='Search by job title or company...'
									className='w-full h-12 pl-12 text-base'
								/>
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-4'>
								<FormSelect
									control={form.control}
									name='zone'
									label=''
									options={zones}
									labelKey='nameEn'
									valueKey='id'
									className='h-12 text-base'
								/>
								<div className='flex items-center gap-2'>
									<p className='text-sm font-medium'>View:</p>
									<Button
										variant={viewMode === 'grid' ? 'default' : 'outline'}
										size='icon'
										onClick={() => setViewMode('grid')}
										className='h-12 w-12'
									>
										<Grid2X2 className='h-5 w-5' />
									</Button>
									<Button
										variant={viewMode === 'list' ? 'default' : 'outline'}
										size='icon'
										onClick={() => setViewMode('list')}
										className='h-12 w-12'
									>
										<List className='h-5 w-5' />
									</Button>
								</div>
							</div>
						</div>
						<p className='text-sm font-medium text-muted-foreground'>
							Showing {meta.totalRecords || 0} jobs
						</p>
					</div>
				</Form>
			)}

			{isLoading ? (
				<div
					className={cn(
						'grid gap-6',
						viewMode === 'grid'
							? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
							: 'grid-cols-1'
					)}
				>
					{[...Array(meta.limit)].map((_, i) => (
						<Skeleton key={i} className={cn('h-56', viewMode === 'list' && 'h-40')} />
					))}
				</div>
			) : jobs.length > 0 ? (
				<div
					className={cn(
						'grid gap-6',
						viewMode === 'grid'
							? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
							: 'grid-cols-1'
					)}
				>
					{jobs.map((job) => (
						<JobCard key={job.id} job={job} />
					))}
				</div>
			) : (
				<div className='text-center py-16 text-muted-foreground'>
					<p>No job listings found for your criteria.</p>
				</div>
			)}

			{isPaginated && meta.totalRecords && meta.totalRecords > 0 && (
				<div className='pt-6'>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={'Job'} />
				</div>
			)}
		</div>
	);
}

    