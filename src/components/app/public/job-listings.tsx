
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { CircularService } from '@/services/api/circular.service';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Briefcase, Building, Clock, Grid, List, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';
import { Form, useForm } from 'react-hook-form';
import { FormSelect } from '@/components/ui/form-select';
import { MasterDataService } from '@/services/api/master-data.service';
import { IOutsourcingZone } from '@/interfaces/master-data.interface';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

const initMeta: IMeta = { page: 0, limit: 12, totalRecords: 0 };

export function JobListings({ isPaginated = true, showFilters = true, itemLimit }: JobListingsProps) {
	const searchParams = useSearchParams();
	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit || initMeta.limit });
	const [isLoading, setIsLoading] = React.useState(true);
	const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
	const { toast } = useToast();

	const [searchQuery, setSearchQuery] = React.useState(searchParams.get('query') || '');
	const [zoneFilter, setZoneFilter] = React.useState(searchParams.get('zone') || 'all');
	const form = useForm();

	const [outsourcingZones, setOutsourcingZones] = React.useState<IOutsourcingZone[]>([]);

	React.useEffect(() => {
		MasterDataService.outsourcingZone
			.get()
			.then((res) => setOutsourcingZones(res.body))
			.catch(() => toast({ description: 'Could not load outsourcing zones.', variant: 'danger' }));
	}, [toast]);

	const fetchJobs = React.useCallback(
		async (page: number) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						searchKey: searchQuery,
						...(zoneFilter !== 'all' && { zoneId: zoneFilter }),
					},
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
		[searchQuery, zoneFilter, meta.limit, toast]
	);

	React.useEffect(() => {
		fetchJobs(0);
	}, [fetchJobs]);

	const handlePageChange = (newPage: number) => {
		fetchJobs(newPage);
	};

	const handleFilterChange = (e: React.FormEvent) => {
		e.preventDefault();
		fetchJobs(0);
	};

	const getDeadlineClass = (deadline: string) => {
		const daysLeft = differenceInDays(parseISO(deadline), new Date());
		if (daysLeft <= 3) return 'border-danger animate-pulse-subtle';
		if (daysLeft <= 7) return 'border-warning';
		return 'border-transparent';
	};

	const JobCard = ({ job }: { job: ICircular }) => (
		<Link href={`/jobs/${job.id}`} className='h-full'>
			<Card
				className={`h-full flex flex-col group glassmorphism card-hover border-2 ${getDeadlineClass(
					job.circularEndDate
				)}`}
			>
				<CardContent className='p-6 flex-grow flex flex-col'>
					<div className='flex-grow'>
						<div className='flex justify-between items-start'>
							<Badge variant={job.jobRequestType === 'OUTSOURCING' ? 'secondary' : 'default'}>
								{job.jobRequestType === 'OUTSOURCING' ? 'Outsourcing' : 'Permanent'}
							</Badge>
						</div>
						<h3 className='font-headline text-lg font-bold mt-3 group-hover:text-primary transition-colors'>
							{job.postNameEn}
						</h3>
						<div className='text-sm text-muted-foreground mt-1 flex items-center gap-2'>
							<Building className='h-4 w-4' />
							{job.clientOrganizationNameEn}
						</div>
					</div>
					<div className='text-sm text-muted-foreground space-y-2 mt-4 pt-4 border-t'>
						{job.outsourcingZoneNameEn && (
							<div className='flex items-center gap-2'>
								<MapPin className='h-4 w-4' />
								{job.outsourcingZoneNameEn}
							</div>
						)}
						<div className='flex items-center gap-2'>
							<Briefcase className='h-4 w-4' />
							{job.outsourcing ? 'Outsourcing' : 'Permanent'}
						</div>
						<div className='flex items-center gap-2'>
							<Clock className='h-4 w-4' />
							Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);

	const JobList = ({ job }: { job: ICircular }) => (
		<Link href={`/jobs/${job.id}`}>
			<Card
				className={`group glassmorphism card-hover flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-l-4 ${getDeadlineClass(
					job.circularEndDate
				)}`}
			>
				<div className='flex-1'>
					<h3 className='font-headline text-lg font-bold group-hover:text-primary transition-colors'>
						{job.postNameEn}
					</h3>
					<div className='text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1'>
						<span className='flex items-center gap-1.5'>
							<Building className='h-4 w-4' /> {job.clientOrganizationNameEn}
						</span>
						{job.outsourcingZoneNameEn && (
							<span className='flex items-center gap-1.5'>
								<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
							</span>
						)}
						<span className='flex items-center gap-1.5'>
							<Briefcase className='h-4 w-4' />{' '}
							{job.outsourcing ? 'Outsourcing' : 'Permanent'}
						</span>
					</div>
				</div>
				<div className='mt-3 md:mt-0 text-right w-full md:w-auto'>
					<p className='text-sm font-medium'>
						Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
					</p>
					<p className='text-xs text-muted-foreground'>
						{differenceInDays(parseISO(job.circularEndDate), new Date()) > 0
							? `${differenceInDays(parseISO(job.circularEndDate), new Date())} days left`
							: 'Deadline Over'}
					</p>
				</div>
			</Card>
		</Link>
	);

	return (
		<div className='space-y-8'>
			{showFilters && (
				<div className='p-4 rounded-lg bg-card border glassmorphism'>
					<Form {...form}>
						<form onSubmit={handleFilterChange}>
							<div className='grid grid-cols-1 md:grid-cols-12 gap-4 items-end'>
								<div className='relative md:col-span-6 lg:col-span-8'>
									<label htmlFor='search' className='sr-only'>
										Search
									</label>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
									<Input
										id='search'
										type='text'
										placeholder='Search by job title, company, or keywords...'
										className='w-full h-12 pl-12 text-base'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
								<div className='md:col-span-4 lg:col-span-2'>
									<FormSelect
										control={form.control}
										name='zone'
										label='Zone'
										options={[{ id: 'all', nameEn: 'All Zones' }, ...outsourcingZones]}
										valueKey='id'
										labelKey='nameEn'
										value={zoneFilter}
										onChange={(e: any) => setZoneFilter(e.target.value)}
									/>
								</div>
								<div className='md:col-span-2 lg:col-span-2'>
									<Button type='submit' size='lg' className='w-full h-12 text-base font-bold'>
										<Search className='mr-2 h-5 w-5' />
										Find
									</Button>
								</div>
							</div>
						</form>
					</Form>
				</div>
			)}

			<div className='flex justify-between items-center'>
				<p className='text-sm text-muted-foreground'>
					Showing <span className='font-bold text-foreground'>{jobs.length}</span> of{' '}
					<span className='font-bold text-foreground'>{meta.totalRecords}</span> jobs
				</p>
				<div className='flex items-center gap-2'>
					<Button
						variant={viewMode === 'grid' ? 'default' : 'outline'}
						size='icon'
						onClick={() => setViewMode('grid')}
					>
						<Grid className='h-5 w-5' />
					</Button>
					<Button
						variant={viewMode === 'list' ? 'default' : 'outline'}
						size='icon'
						onClick={() => setViewMode('list')}
					>
						<List className='h-5 w-5' />
					</Button>
				</div>
			</div>

			{isLoading ? (
				<div
					className={
						viewMode === 'grid'
							? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
							: 'space-y-4'
					}
				>
					{[...Array(meta.limit)].map((_, i) => (
						<Skeleton key={i} className={viewMode === 'grid' ? 'h-72' : 'h-24'} />
					))}
				</div>
			) : jobs.length > 0 ? (
				viewMode === 'grid' ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{jobs.map((job) => (
							<JobCard key={job.id} job={job} />
						))}
					</div>
				) : (
					<div className='space-y-4'>
						{jobs.map((job) => (
							<JobList key={job.id} job={job} />
						))}
					</div>
				)
			) : (
				<div className='text-center py-16'>
					<h3 className='text-xl font-semibold'>No Jobs Found</h3>
					<p className='text-muted-foreground mt-2'>
						Your search did not match any job listings. Try broadening your criteria.
					</p>
				</div>
			)}

			{isPaginated && meta && meta.totalRecords! > meta.limit && (
				<div className='flex justify-center'>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='job' />
				</div>
			)}
		</div>
	);

    