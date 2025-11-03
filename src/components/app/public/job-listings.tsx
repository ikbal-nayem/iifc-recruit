
'use client';

import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { CircularService } from '@/services/api/circular.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { cn } from '@/lib/utils';
import { differenceInDays, parseISO } from 'date-fns';
import { Building, Calendar, Clock, DollarSign, Grid, List, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Form, useForm } from 'react-hook-form';
import { FormSelect } from '@/components/ui/form-select';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Pagination } from '../../ui/pagination';
import { Skeleton } from '../../ui/skeleton';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

const JobCard = ({ job, viewMode }: { job: ICircular; viewMode: 'grid' | 'list' }) => {
	const deadline = parseISO(job.circularEndDate);
	const daysRemaining = differenceInDays(deadline, new Date());
	const deadlineColorClass =
		daysRemaining <= 3 ? 'border-danger animate-pulse-subtle' : daysRemaining <= 7 ? 'border-warning' : '';

	if (viewMode === 'list') {
		return (
			<Card
				className={cn(
					'w-full transition-all hover:shadow-md glassmorphism flex flex-col md:flex-row items-start',
					deadlineColorClass
				)}
			>
				<CardContent className='p-4 flex-1 space-y-2'>
					<Link
						href={`/jobs/${job.id}`}
						className='block text-lg font-bold hover:text-primary transition-colors'
					>
						{job.postNameEn}
					</Link>
					<div className='flex items-center text-sm text-muted-foreground gap-x-4 gap-y-1 flex-wrap'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' /> {job.clientOrganizationNameEn}
						</span>
						{job.outsourcingZoneNameEn && (
							<span className='flex items-center gap-1.5'>
								<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
							</span>
						)}
					</div>
					<div className='flex items-center text-sm text-muted-foreground gap-x-4 gap-y-1 flex-wrap'>
						<span className='flex items-center gap-1.5'>
							<Clock className='h-4 w-4' /> {job.outsourcing ? 'Outsourcing' : 'Permanent'}
						</span>
						{(job.salaryFrom || job.salaryTo) && (
							<span className='flex items-center gap-1.5'>
								<DollarSign className='h-4 w-4' /> {job.salaryFrom} - {job.salaryTo}
							</span>
						)}
					</div>
				</CardContent>
				<div className='p-4 flex md:flex-col items-end md:items-center justify-between md:justify-center w-full md:w-auto md:border-l border-t md:border-t-0 space-y-2'>
					<div className='text-center'>
						<div className='text-xs text-muted-foreground'>Deadline</div>
						<div className='font-semibold'>{format(deadline, 'dd MMM, yyyy')}</div>
					</div>
					<Button asChild size='sm'>
						<Link href={`/jobs/${job.id}`}>View Details</Link>
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<Link href={`/jobs/${job.id}`}>
			<Card className={cn('h-full transition-all hover:shadow-lg card-hover glassmorphism', deadlineColorClass)}>
				<CardContent className='p-4 space-y-3'>
					<div className='flex justify-between items-start'>
						<Badge variant='secondary'>{job.outsourcing ? 'Outsourcing' : 'Permanent'}</Badge>
						<div className='text-xs text-right text-muted-foreground'>
							<p>Deadline</p>
							<p>{format(deadline, 'dd MMM, yyyy')}</p>
						</div>
					</div>
					<div>
						<h3 className='font-bold text-lg leading-tight'>{job.postNameEn}</h3>
						<p className='text-sm text-muted-foreground'>{job.clientOrganizationNameEn}</p>
					</div>

					<div className='text-sm text-muted-foreground space-y-1 pt-2 border-t'>
						{job.outsourcingZoneNameEn && (
							<span className='flex items-center gap-1.5'>
								<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
							</span>
						)}
						{(job.salaryFrom || job.salaryTo) && (
							<span className='flex items-center gap-1.5'>
								<DollarSign className='h-4 w-4' /> {job.salaryFrom} - {job.salaryTo}
							</span>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit = 9,
}: JobListingsProps) {
	const searchParams = useSearchParams();
	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [outsourcingZones, setOutsourcingZones] = React.useState<ICommonMasterData[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({
		page: 0,
		limit: itemLimit,
		totalRecords: 0,
	});
	const [isLoading, setIsLoading] = React.useState(true);
	const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

	const [searchQuery, setSearchQuery] = React.useState('');
	const [zoneFilter, setZoneFilter] = React.useState('');
	const form = useForm();

	const fetchJobs = React.useCallback(
		async (page: number, search: string, zoneId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						searchKey: search,
						...(zoneId && zoneId !== 'all' && { outsourcingZoneId: zoneId }),
					},
					meta: { page, limit: itemLimit },
				};
				const response = await CircularService.search(payload);
				setJobs(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit]
	);

	const fetchZones = React.useCallback(async () => {
		try {
			const response = await MasterDataService.outsourcingZone.get();
			setOutsourcingZones(response.body);
		} catch (error) {
			console.error('Failed to fetch outsourcing zones', error);
		}
	}, []);

	React.useEffect(() => {
		const page = parseInt(searchParams.get('page') || '1', 10) - 1;
		fetchJobs(page, searchQuery, zoneFilter);
	}, [searchParams, fetchJobs, searchQuery, zoneFilter]);

	React.useEffect(() => {
		if (showFilters) {
			fetchZones();
		}
	}, [showFilters, fetchZones]);

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', (newPage + 1).toString());
		window.history.pushState(null, '', `?${params.toString()}`);
		fetchJobs(newPage, searchQuery, zoneFilter);
	};

	const JobListingSkeleton = () => (
		<div
			className={cn(
				'grid gap-6',
				viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
			)}
		>
			{[...Array(itemLimit)].map((_, i) => (
				<Card key={i}>
					<CardContent className='p-4 space-y-3'>
						<div className='flex justify-between'>
							<Skeleton className='h-5 w-24' />
							<Skeleton className='h-5 w-16' />
						</div>
						<Skeleton className='h-6 w-3/4' />
						<Skeleton className='h-5 w-1/2' />
						<div className='pt-2 border-t space-y-2'>
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-2/3' />
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Form {...form}>
					<div className='p-4 border rounded-lg bg-card glassmorphism'>
						<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end'>
							<div className='md:col-span-2 lg:col-span-2'>
								<label htmlFor='search' className='block text-sm font-medium mb-1'>
									Job Title or Keyword
								</label>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
									<Input
										id='search'
										type='text'
										placeholder='Search for jobs...'
										className='w-full h-11 pl-12 text-base'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>
							<div className='w-full'>
								<FormSelect
									control={form.control}
									name='zone'
									label='Outsourcing Zone'
									placeholder='All Zones'
									options={[{ id: 'all', nameEn: 'All Zones' }, ...outsourcingZones]}
									valueKey='id'
									labelKey='nameEn'
									onValueChange={setZoneFilter}
								/>
							</div>

							<div className='flex items-end justify-between'>
								<div className='text-sm font-semibold'>
									{meta.totalRecords ?? 0} Jobs Found
								</div>
								<div className='flex items-center gap-1 border p-1 rounded-md'>
									<Button
										variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
										size='icon'
										onClick={() => setViewMode('grid')}
										className='h-8 w-8'
									>
										<Grid className='h-5 w-5' />
									</Button>
									<Button
										variant={viewMode === 'list' ? 'secondary' : 'ghost'}
										size='icon'
										onClick={() => setViewMode('list')}
										className='h-8 w-8'
									>
										<List className='h-5 w-5' />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</Form>
			)}

			{isLoading ? (
				<JobListingSkeleton />
			) : jobs.length > 0 ? (
				<>
					<div
						className={cn(
							'grid gap-6',
							viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
						)}
					>
						{jobs.map((job) => (
							<JobCard key={job.id} job={job} viewMode={viewMode} />
						))}
					</div>
					{isPaginated && meta.totalRecords && meta.totalRecords > itemLimit && (
						<Pagination meta={meta} onPageChange={handlePageChange} noun='Job' />
					)}
				</>
			) : (
				<div className='text-center py-16'>
					<h3 className='text-xl font-semibold'>No Jobs Found</h3>
					<p className='text-muted-foreground mt-2'>
						Your search did not match any job listings. Try different keywords or filters.
					</p>
				</div>
			)}
		</div>
	);
}
