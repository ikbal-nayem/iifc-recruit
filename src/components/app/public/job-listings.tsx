
'use client';

import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { IOutsourcingZone } from '@/interfaces/master-data.interface';
import { CircularService } from '@/services/api/circular.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { differenceInDays, isFuture, parseISO } from 'date-fns';
import { Briefcase, Calendar, Grid, List, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Pagination } from '../../ui/pagination';
import { Skeleton } from '../../ui/skeleton';
import { Form } from '@/components/ui/form';
import { FormSelect } from '@/components/ui/form-select';
import { useForm } from 'react-hook-form';

const VIEW_MODE = {
	GRID: 'grid',
	LIST: 'list',
};

function JobCard({ job, viewMode }: { job: ICircular; viewMode: string }) {
	const deadline = parseISO(job.circularEndDate);
	const daysUntilDeadline = differenceInDays(deadline, new Date());
	const isUrgent = isFuture(deadline) && daysUntilDeadline <= 7;
	const isVeryUrgent = isFuture(deadline) && daysUntilDeadline <= 3;

	const cardClasses = cn(
		'group glassmorphism card-hover h-full flex flex-col',
		isVeryUrgent && 'border-danger/50 animate-pulse-subtle',
		isUrgent && !isVeryUrgent && 'border-warning/50'
	);

	if (viewMode === VIEW_MODE.LIST) {
		return (
			<Link href={`/jobs/${job.id}`} className='block'>
				<Card className={cn(cardClasses, 'flex-row items-center p-4')}>
					<div className='flex-1'>
						<p className='font-semibold group-hover:text-primary transition-colors'>{job.postNameEn}</p>
						<p className='text-sm text-muted-foreground'>{job.clientOrganizationNameEn}</p>
						<div className='flex items-center gap-4 text-xs text-muted-foreground mt-1'>
							<span className='flex items-center gap-1.5'>
								<MapPin className='h-3 w-3' /> {job.outsourcingZoneNameEn || 'N/A'}
							</span>
							<span className='flex items-center gap-1.5'>
								<Briefcase className='h-3 w-3' /> {job.outsourcing ? 'Outsourcing' : 'Permanent'}
							</span>
						</div>
					</div>
					<div className='text-right'>
						<Badge variant={isVeryUrgent ? 'danger' : isUrgent ? 'warning' : 'secondary'}>
							<Calendar className='mr-1.5 h-3 w-3' />
							{`Closes in ${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'day' : 'days'}`}
						</Badge>
						<p className='text-xs text-muted-foreground mt-1'>
							Posted on {format(parseISO(job.circularPublishDate), 'dd MMM')}
						</p>
					</div>
				</Card>
			</Link>
		);
	}

	return (
		<Link href={`/jobs/${job.id}`} className='block h-full'>
			<Card className={cardClasses}>
				<CardContent className='p-6 flex-grow'>
					<Badge variant={isVeryUrgent ? 'danger' : isUrgent ? 'warning' : 'secondary'} className='mb-3'>
						<Calendar className='mr-1.5 h-3 w-3' />
						{`Closes in ${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'day' : 'days'}`}
					</Badge>
					<h3 className='font-semibold group-hover:text-primary transition-colors'>{job.postNameEn}</h3>
					<p className='text-sm text-muted-foreground mt-1'>{job.clientOrganizationNameEn}</p>
					<div className='mt-4 space-y-2 text-sm text-muted-foreground'>
						<p className='flex items-center gap-2'>
							<MapPin className='h-4 w-4' />
							<span>{job.outsourcingZoneNameEn || 'N/A'}</span>
						</p>
						<p className='flex items-center gap-2'>
							<Briefcase className='h-4 w-4' />
							<span>{job.outsourcing ? 'Outsourcing' : 'Permanent'}</span>
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit = 12,
}: {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [jobs, setJobs] = useState<ICircular[]>([]);
	const [meta, setMeta] = useState<IMeta>({ page: 0, limit: itemLimit });
	const [isLoading, setIsLoading] = useState(true);
	const [outsourcingZones, setOutsourcingZones] = useState<IOutsourcingZone[]>([]);

	const [viewMode, setViewMode] = useState(VIEW_MODE.GRID);
	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
	const [zoneFilter, setZoneFilter] = useState(searchParams.get('zone') || 'all');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const form = useForm();

	const loadJobs = useCallback(
		async (page: number) => {
			setIsLoading(true);
			const params = new URLSearchParams();
			if (debouncedSearch) params.set('q', debouncedSearch);
			if (zoneFilter !== 'all') params.set('zone', zoneFilter);

			const payload: IApiRequest = {
				body: { searchKey: debouncedSearch, outsourcingZoneId: zoneFilter === 'all' ? undefined : zoneFilter },
				meta: { page, limit: itemLimit },
			};
			router.push(`?${params.toString()}`, { scroll: false });

			try {
				const res = await CircularService.search(payload);
				setJobs(res.body);
				setMeta(res.meta);
			} catch (error) {
				console.error('Failed to load jobs:', error);
			} finally {
				setIsLoading(false);
			}
		},
		[debouncedSearch, zoneFilter, itemLimit, router]
	);

	useEffect(() => {
		async function fetchZones() {
			try {
				const res = await MasterDataService.outsourcingZone.get();
				setOutsourcingZones(res.body);
			} catch (error) {
				console.error('Failed to fetch zones');
			}
		}
		fetchZones();
	}, []);

	useEffect(() => {
		loadJobs(0);
	}, [loadJobs]);

	const handlePageChange = (page: number) => {
		loadJobs(page);
	};

	const gridClasses = cn(
		'grid gap-6',
		viewMode === VIEW_MODE.GRID
			? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
			: 'grid-cols-1'
	);

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Card className='p-4 glassmorphism'>
					<div className='flex flex-col md:flex-row items-center gap-4'>
						<div className='relative w-full flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search by job title or company...'
								className='pl-10 h-12'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<div className='flex items-center gap-2 w-full md:w-auto'>
							<Form {...form}>
								<div className='w-full md:w-52'>
									<FormSelect
										control={form.control}
										name='zoneFilter'
										label=''
										placeholder='Filter by Zone...'
										options={[{ id: 'all', nameEn: 'All Zones' }, ...outsourcingZones]}
										valueKey='id'
										labelKey='nameEn'
										onValueChange={(val: any) => setZoneFilter(val as string)}
										value={zoneFilter}
									/>
								</div>
							</Form>

							<div className='bg-background border p-1 rounded-md flex items-center'>
								<Button
									variant={viewMode === VIEW_MODE.GRID ? 'secondary' : 'ghost'}
									size='icon'
									onClick={() => setViewMode(VIEW_MODE.GRID)}
								>
									<Grid className='h-5 w-5' />
								</Button>
								<Button
									variant={viewMode === VIEW_MODE.LIST ? 'secondary' : 'ghost'}
									size='icon'
									onClick={() => setViewMode(VIEW_MODE.LIST)}
								>
									<List className='h-5 w-5' />
								</Button>
							</div>
						</div>
					</div>
				</Card>
			)}

			<div>
				{showFilters && (
					<div className='mb-4'>
						<p className='text-sm text-muted-foreground'>
							Showing <span className='font-bold text-foreground'>{meta.totalRecords || 0}</span> job
							openings
						</p>
					</div>
				)}
				{isLoading ? (
					<div className={gridClasses}>
						{[...Array(itemLimit)].map((_, i) => (
							<Skeleton key={i} className='h-48 rounded-lg' />
						))}
					</div>
				) : jobs.length > 0 ? (
					<div className={gridClasses}>
						{jobs.map((job) => (
							<JobCard key={job.id} job={job} viewMode={viewMode} />
						))}
					</div>
				) : (
					<div className='text-center py-16 border rounded-lg bg-background'>
						<Search className='mx-auto h-12 w-12 text-muted-foreground' />
						<h3 className='mt-4 text-lg font-semibold'>No Jobs Found</h3>
						<p className='mt-2 text-sm text-muted-foreground'>
							Try adjusting your search or filters to find what you&apos;re looking for.
						</p>
					</div>
				)}
			</div>

			{isPaginated && meta && meta.totalRecords! > itemLimit && (
				<div className='flex justify-center'>
					<Pagination meta={meta} onPageChange={handlePageChange} noun='job' />
				</div>
			)}
		</div>
	);
}
