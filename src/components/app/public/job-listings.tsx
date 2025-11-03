'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormSelect } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { IOutsourcingZone } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { CircularService } from '@/services/api/circular.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { differenceInDays, format, parseISO } from 'date-fns';
import { Briefcase, Clock, DollarSign, Grip, List, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

const initMeta: IMeta = { page: 0, limit: 12, totalRecords: 0 };

export function JobListings({ isPaginated = true, showFilters = true, itemLimit = 12 }: JobListingsProps) {
	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [zoneFilter, setZoneFilter] = React.useState('all');
	const [zones, setZones] = React.useState<IOutsourcingZone[]>([]);
	const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

	const debouncedSearch = useDebounce(searchQuery, 500);

	React.useEffect(() => {
		async function fetchZones() {
			try {
				const response = await MasterDataService.outsourcingZone.get();
				setZones(response.body);
			} catch (error) {
				console.error('Failed to load zones:', error);
			}
		}
		fetchZones();
	}, []);

	const loadJobs = React.useCallback(
		async (page: number, search: string, zone: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						searchKey: search,
						...(zone !== 'all' && { outsourcingZoneId: zone }),
					},
					meta: { page: page, limit: itemLimit },
				};
				const response = await CircularService.search(payload);
				setJobs(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load jobs:', error);
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit]
	);

	React.useEffect(() => {
		loadJobs(0, debouncedSearch, zoneFilter);
	}, [debouncedSearch, zoneFilter, loadJobs]);

	const handlePageChange = (newPage: number) => {
		loadJobs(newPage, debouncedSearch, zoneFilter);
	};

	const getDeadlineColor = (deadline: string) => {
		const daysLeft = differenceInDays(parseISO(deadline), new Date());
		if (daysLeft <= 0) return 'border-gray-500';
		if (daysLeft <= 3) return 'border-red-500 animate-pulse-subtle';
		if (daysLeft <= 7) return 'border-yellow-500';
		return 'border-transparent';
	};

	const JobCard = ({ job }: { job: ICircular }) => (
		<Link href={`/jobs/${job.id}`} className='block h-full'>
			<Card
				className={cn(
					'h-full flex flex-col group glassmorphism card-hover border-2',
					getDeadlineColor(job.circularEndDate)
				)}
			>
				<div className='p-6 flex-grow'>
					<div className='flex justify-between items-start'>
						<h3 className='font-headline text-lg font-bold group-hover:text-primary transition-colors pr-2'>
							{job.postNameEn}
						</h3>
						<Badge variant={job.outsourcing ? 'secondary' : 'outline'}>
							{job.outsourcing ? 'Outsourcing' : 'Permanent'}
						</Badge>
					</div>
					<p className='text-sm text-muted-foreground mt-1'>{job.clientOrganizationNameEn}</p>
					<div className='mt-4 space-y-2 text-sm text-muted-foreground'>
						{job.outsourcingZoneNameEn && (
							<p className='flex items-center gap-2'>
								<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
							</p>
						)}
						<p className='flex items-center gap-2'>
							<Briefcase className='h-4 w-4' /> {job.vacancy} vacancies
						</p>
						{(job.salaryFrom || job.salaryTo) && (
							<p className='flex items-center gap-2'>
								<DollarSign className='h-4 w-4' /> {job.salaryFrom} - {job.salaryTo}
							</p>
						)}
					</div>
				</div>
				<div className='p-6 pt-0 flex justify-between items-center text-xs text-muted-foreground border-t mt-auto'>
					<p className='flex items-center gap-2'>
						<Clock className='h-4 w-4' />
						Deadline:
					</p>
					<p className='font-semibold text-foreground'>
						{format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
					</p>
				</div>
			</Card>
		</Link>
	);

	const JobListRow = ({ job }: { job: ICircular }) => (
		<Link href={`/jobs/${job.id}`} className='block'>
			<Card
				className={cn(
					'flex flex-col md:flex-row md:items-center justify-between p-4 group glassmorphism card-hover border-2',
					getDeadlineColor(job.circularEndDate)
				)}
			>
				<div className='flex-1 mb-4 md:mb-0'>
					<h3 className='font-headline text-lg font-bold group-hover:text-primary transition-colors'>
						{job.postNameEn}
					</h3>
					<p className='text-sm text-muted-foreground'>{job.clientOrganizationNameEn}</p>
					<div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2'>
						{job.outsourcingZoneNameEn && (
							<span className='flex items-center gap-2'>
								<MapPin className='h-4 w-4' /> {job.outsourcingZoneNameEn}
							</span>
						)}
						<span className='flex items-center gap-2'>
							<Briefcase className='h-4 w-4' /> {job.vacancy} vacancies
						</span>
						{(job.salaryFrom || job.salaryTo) && (
							<span className='flex items-center gap-2'>
								<DollarSign className='h-4 w-4' /> {job.salaryFrom} - {job.salaryTo}
							</span>
						)}
					</div>
				</div>
				<div className='flex items-center justify-between md:justify-end w-full md:w-auto gap-4'>
					<Badge variant={job.outsourcing ? 'secondary' : 'outline'}>
						{job.outsourcing ? 'Outsourcing' : 'Permanent'}
					</Badge>
					<div className='text-right'>
						<p className='text-xs text-muted-foreground'>Deadline</p>
						<p className='font-semibold text-sm'>{format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}</p>
					</div>
				</div>
			</Card>
		</Link>
	);

	return (
		<div className='space-y-8'>
			{showFilters && (
				<div className='p-4 border rounded-lg bg-card shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4'>
					<div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='relative w-full'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search by job title or company...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10 h-12'
							/>
						</div>
						<FormSelect
							name='zone'
							placeholder='All Zones'
							options={[{ id: 'all', nameEn: 'All Zones' }, ...zones]}
							getOptionValue={(option) => option.id}
							getOptionLabel={(option) => option.nameEn}
							onValueChange={(val) => setZoneFilter(val || 'all')}
							value={zoneFilter}
						/>
					</div>
					<div className='flex items-center justify-between border-t md:border-t-0 pt-4 md:pt-0 md:pl-4 md:border-l'>
						<p className='text-sm text-muted-foreground font-medium'>{meta.totalRecords ?? 0} jobs found</p>
						<div className='flex items-center gap-1 ml-4'>
							<Button
								variant={viewMode === 'grid' ? 'default' : 'ghost'}
								size='icon'
								onClick={() => setViewMode('grid')}
							>
								<Grip className='h-5 w-5' />
							</Button>
							<Button
								variant={viewMode === 'list' ? 'default' : 'ghost'}
								size='icon'
								onClick={() => setViewMode('list')}
							>
								<List className='h-5 w-5' />
							</Button>
						</div>
					</div>
				</div>
			)}
			{isLoading ? (
				<div
					className={cn(
						'grid gap-6',
						viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 space-y-4'
					)}
				>
					{[...Array(itemLimit)].map((_, i) => (
						<Skeleton key={i} className={cn('rounded-lg', viewMode === 'grid' ? 'h-64' : 'h-28')} />
					))}
				</div>
			) : jobs.length > 0 ? (
				<>
					<div
						className={cn(
							'grid gap-6',
							viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 space-y-4'
						)}
					>
						{jobs.map((job) =>
							viewMode === 'grid' ? <JobCard key={job.id} job={job} /> : <JobListRow key={job.id} job={job} />
						)}
					</div>
					{isPaginated && meta.totalPageCount! > 1 && (
						<div className='pt-8'>
							<Pagination meta={meta} onPageChange={handlePageChange} noun='job' />
						</div>
					)}
				</>
			) : (
				<div className='text-center py-16'>
					<h3 className='text-2xl font-bold'>No Jobs Found</h3>
					<p className='text-muted-foreground mt-2'>
						We couldn't find any jobs matching your criteria. Try adjusting your filters.
					</p>
				</div>
			)}
		</div>
	);
}
