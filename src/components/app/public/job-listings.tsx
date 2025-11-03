
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
import { differenceInDays, format, parseISO } from 'date-fns';
import { Briefcase, Calendar, Clock, Grid, List, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Form, useForm } from 'react-hook-form';
import { FormSelect } from '@/components/ui/form-select';

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

const initMeta: IMeta = { page: 0, limit: 9, totalRecords: 0 };

export function JobListings({ isPaginated = true, showFilters = true, itemLimit = 9 }: JobListingsProps) {
	const [jobs, setJobs] = React.useState<ICircular[]>([]);
	const [meta, setMeta] = React.useState<IMeta>({ ...initMeta, limit: itemLimit });
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
	const [zoneFilter, setZoneFilter] = React.useState('all');
	const [outsourcingZones, setOutsourcingZones] = React.useState<IOutsourcingZone[]>([]);
	const { toast } = useToast();
	const debouncedSearch = useDebounce(searchQuery, 500);

	const form = useForm();

	React.useEffect(() => {
		MasterDataService.outsourcingZone
			.get()
			.then((res) => {
				setOutsourcingZones([{ id: 'all', nameEn: 'All Zones', nameBn: 'সব জোন' } as any, ...res.body]);
			})
			.catch(() => {
				toast({
					title: 'Error',
					description: 'Could not load outsourcing zones.',
					variant: 'danger',
				});
			});
	}, [toast]);

	const loadJobs = React.useCallback(
		async (page: number, search: string, zoneId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						postNameEn: search,
						...(zoneId !== 'all' && { outsourcingZoneId: zoneId }),
					},
					meta: { page: page, limit: itemLimit },
				};
				const response = await CircularService.search(payload);
				setJobs(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast({
					description: error.message || 'Failed to load jobs.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[itemLimit, toast]
	);

	React.useEffect(() => {
		loadJobs(0, debouncedSearch, zoneFilter);
	}, [debouncedSearch, zoneFilter, loadJobs]);

	const handlePageChange = (newPage: number) => {
		loadJobs(newPage, debouncedSearch, zoneFilter);
	};

	const getDeadlineVariant = (deadline: string) => {
		const daysUntil = differenceInDays(parseISO(deadline), new Date());
		if (daysUntil <= 3) return 'danger';
		if (daysUntil <= 7) return 'warning';
		return 'default';
	};

	const renderGridItem = (job: ICircular) => {
		const deadlineVariant = getDeadlineVariant(job.circularEndDate);
		const cardClass = {
			danger: 'border-danger pulse-danger',
			warning: 'border-warning pulse-warning',
			default: '',
		}[deadlineVariant];

		return (
			<Link key={job.id} href={`/jobs/${job.id}`} className='block h-full'>
				<Card
					className={cn('flex flex-col h-full glassmorphism card-hover transition-all', cardClass)}
				>
					<CardHeader>
						<CardTitle className='text-lg font-bold group-hover:text-primary'>{job.postNameEn}</CardTitle>
						<p className='text-sm text-muted-foreground'>{job.clientOrganizationNameEn}</p>
					</CardHeader>
					<CardContent className='flex-grow text-sm space-y-2'>
						<div className='flex items-center gap-2 text-muted-foreground'>
							<Briefcase className='h-4 w-4' />
							<span>{job.postNameEn}</span>
						</div>
						<div className='flex items-center gap-2 text-muted-foreground'>
							<MapPin className='h-4 w-4' />
							<span>{job.outsourcingZoneNameEn || 'Not specified'}</span>
						</div>
						<div className='flex items-center gap-2 text-muted-foreground'>
							<Clock className='h-4 w-4' />
							<span>{job.outsourcing ? 'Outsourcing' : 'Permanent'}</span>
						</div>
					</CardContent>
					<CardFooter>
						<Badge variant={deadlineVariant} className='w-full justify-center'>
							<Calendar className='mr-2 h-4 w-4' />
							Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
						</Badge>
					</CardFooter>
				</Card>
			</Link>
		);
	};

	const renderListItem = (job: ICircular) => {
		const deadlineVariant = getDeadlineVariant(job.circularEndDate);
		const cardClass = {
			danger: 'border-danger pulse-danger',
			warning: 'border-warning pulse-warning',
			default: '',
		}[deadlineVariant];

		return (
			<Link key={job.id} href={`/jobs/${job.id}`} className='block'>
				<Card
					className={cn(
						'glassmorphism card-hover p-4 flex flex-col sm:flex-row justify-between items-start gap-4',
						cardClass
					)}
				>
					<div className='flex-1'>
						<p className='font-semibold'>{job.postNameEn}</p>
						<p className='text-sm text-muted-foreground'>{job.clientOrganizationNameEn}</p>
						<div className='text-xs text-muted-foreground flex items-center gap-4 mt-2'>
							<span className='flex items-center gap-1.5'>
								<MapPin className='h-3 w-3' />
								{job.outsourcingZoneNameEn || 'Not specified'}
							</span>
							<span className='flex items-center gap-1.5'>
								<Clock className='h-3 w-3' />
								{job.outsourcing ? 'Outsourcing' : 'Permanent'}
							</span>
						</div>
					</div>
					<div className='w-full sm:w-auto flex sm:flex-col items-end justify-between gap-2'>
						<Badge variant={deadlineVariant}>
							Deadline: {format(parseISO(job.circularEndDate), 'dd MMM, yyyy')}
						</Badge>
						<Button size='sm' variant='outline' className='hidden sm:inline-flex'>
							View Details
						</Button>
					</div>
				</Card>
			</Link>
		);
	};

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Form {...form}>
					<div className='p-4 border rounded-lg bg-card glassmorphism'>
						<div className='flex flex-col md:flex-row items-center gap-4'>
							<div className='relative w-full flex-1'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search by job title or keyword...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='pl-10 h-11'
								/>
							</div>
							<div className='w-full md:w-52'>
								<FormSelect
									control={form.control}
									name='zoneFilter'
									placeholder='All Zones'
									options={outsourcingZones}
									value={zoneFilter}
									onValueChange={setZoneFilter}
									getOptionValue={(option) => option.id!}
									getOptionLabel={(option) => option.nameEn}
								/>
							</div>
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
						<div className='mt-4 text-sm text-muted-foreground'>
							{isLoading ? (
								<Skeleton className='h-5 w-32' />
							) : (
								<p>
									Showing <strong>{jobs.length}</strong> of <strong>{meta.totalRecords}</strong> jobs
								</p>
							)}
						</div>
					</div>
				</Form>
			)}

			{isLoading ? (
				<div
					className={cn(
						'grid gap-6',
						viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'
					)}
				>
					{[...Array(itemLimit)].map((_, i) => (
						<Skeleton
							key={i}
							className={cn(
								'w-full',
								viewMode === 'grid' ? 'h-64' : 'h-24'
							)}
						/>
					))}
				</div>
			) : jobs.length > 0 ? (
				<div
					className={cn(
						'grid gap-6',
						viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
					)}
				>
					{jobs.map((job) => (viewMode === 'grid' ? renderGridItem(job) : renderListItem(job)))}
				</div>
			) : (
				<div className='text-center py-16'>
					<h3 className='text-xl font-semibold'>No Jobs Found</h3>
					<p className='text-muted-foreground mt-2'>
						Try adjusting your search or filter criteria.
					</p>
				</div>
			)}

			{isPaginated && meta && meta.totalRecords && meta.totalRecords > itemLimit && (
				<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={'Job'} />
			)}
		</div>
	);
}
