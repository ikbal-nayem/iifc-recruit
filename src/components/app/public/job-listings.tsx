'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormSelect } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';
import { IOutsourcingZone } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { CircularService } from '@/services/api/circular.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { differenceInDays, format, isBefore, parseISO } from 'date-fns';
import { Briefcase, Clock, LayoutGrid, List, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { Form, useForm } from 'react-hook-form';

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
	const [zoneFilter, setZoneFilter] = React.useState('all');
	const [outsourcingZones, setOutsourcingZones] = React.useState<IOutsourcingZone[]>([]);
	const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

	const debouncedSearch = useDebounce(searchQuery, 500);
	const { toast } = useToast();
	const form = useForm();

	React.useEffect(() => {
		const fetchZones = async () => {
			try {
				const response = await MasterDataService.outsourcingZone.get();
				setOutsourcingZones(response.body);
			} catch (error) {
				console.error('Failed to fetch outsourcing zones', error);
			}
		};
		fetchZones();
	}, []);

	const loadJobs = React.useCallback(
		async (page: number, search: string, zoneId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						nameEn: search,
						...(zoneId !== 'all' && { outsourcingZoneId: zoneId }),
					},
					meta: { page, limit: itemLimit },
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

	const JobCard = ({ job }: { job: ICircular }) => {
		const now = new Date();
		const deadline = parseISO(job.circularEndDate);
		const isExpired = isBefore(deadline, now);
		const daysUntilDeadline = differenceInDays(deadline, now);

		const cardBorderColor = isExpired
			? 'border-slate-300'
			: daysUntilDeadline <= 3
			? 'border-danger animate-pulse-subtle'
			: daysUntilDeadline <= 7
			? 'border-warning'
			: 'border-transparent';

		return (
			<Link href={`/jobs/${job.id}`} className='h-full'>
				<Card
					className={cn(
						'h-full flex flex-col group glassmorphism card-hover border-2',
						cardBorderColor,
						viewMode === 'list' && 'md:flex-row md:items-center'
					)}
				>
					<div className={cn('p-6 flex-1', viewMode === 'list' && 'md:border-r')}>
						<div className='flex justify-between items-start'>
							<h3 className='font-bold text-lg group-hover:text-primary transition-colors'>
								{job.postNameEn}
							</h3>
						</div>
						<p className='text-sm text-muted-foreground mt-1'>{job.clientOrganizationNameEn}</p>

						<div
							className={cn(
								'text-sm text-muted-foreground mt-4 space-y-2',
								viewMode === 'list' && 'md:flex md:gap-6 md:space-y-0'
							)}
						>
							{job.outsourcingZoneNameEn && (
								<p className='flex items-center gap-2'>
									<MapPin className='h-4 w-4' />
									<span>{job.outsourcingZoneNameEn}</span>
								</p>
							)}
							<p className='flex items-center gap-2'>
								<Briefcase className='h-4 w-4' />
								<span>{job.jobRequestType === 'OUTSOURCING' ? 'Outsourcing' : 'Permanent'}</span>
							</p>
						</div>
					</div>

					<div
						className={cn(
							'p-6 pt-0 flex flex-col justify-between gap-4',
							viewMode === 'list' && 'md:pt-6 md:w-52 md:flex-shrink-0'
						)}
					>
						<div className='flex items-center gap-2 text-sm'>
							<Clock className='h-4 w-4 text-muted-foreground' />
							<div>
								<p className='font-medium'>Deadline</p>
								<p
									className={cn(
										'font-semibold',
										isExpired
											? 'text-slate-500'
											: daysUntilDeadline <= 3
											? 'text-danger'
											: daysUntilDeadline <= 7
											? 'text-warning'
											: ''
									)}
								>
									{format(deadline, 'dd MMM, yyyy')}
								</p>
							</div>
						</div>
						<Button className='w-full'>{isExpired ? 'View Details' : 'Apply Now'}</Button>
					</div>
				</Card>
			</Link>
		);
	};

	return (
		<div className='space-y-8'>
			{showFilters && (
				<Form {...form}>
					<div className='flex flex-col md:flex-row gap-4 justify-between items-start md:items-end'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:flex lg:gap-4 w-full lg:w-auto'>
							<div className='w-full lg:w-64'>
								<Label htmlFor='search'>Job Title or Keyword</Label>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
									<Input
										id='search'
										placeholder='Search...'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className='pl-10 h-11'
									/>
								</div>
							</div>
							<div className='w-full lg:w-52'>
								<FormSelect
									control={form.control}
									name='zoneFilter'
									label='Outsourcing Zone'
									options={[{ id: 'all', nameEn: 'All Zones' }, ...outsourcingZones]}
									getOptionValue={(option) => option.id!}
									getOptionLabel={(option) => option.nameEn}
									onValueChange={(value: any) => setZoneFilter(value)}
									value={zoneFilter}
								/>
							</div>
						</div>
						<div className='flex-shrink-0 flex items-center justify-between w-full md:w-auto'>
							<p className='text-sm font-medium md:hidden'>{meta.totalRecords ?? 0} jobs found</p>
							<div className='flex items-center gap-2'>
								<Button
									variant={viewMode === 'grid' ? 'default' : 'outline'}
									size='icon'
									onClick={() => setViewMode('grid')}
								>
									<LayoutGrid className='h-5 w-5' />
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
					</div>
					<p className='hidden md:block text-sm font-medium mt-2'>{meta.totalRecords ?? 0} jobs found</p>
				</Form>
			)}

			{isLoading ? (
				<div className={cn('grid gap-6', viewMode === 'grid' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}>
					{[...Array(itemLimit)].map((_, i) => (
						<Card key={i} className='h-60 animate-pulse bg-muted/50'></Card>
					))}
				</div>
			) : (
				<>
					{jobs.length > 0 ? (
						<div
							className={cn('grid gap-6', viewMode === 'grid' && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')}
						>
							{jobs.map((job) => (
								<JobCard key={job.id} job={job} />
							))}
						</div>
					) : (
						<div className='text-center py-16'>
							<h3 className='text-xl font-semibold'>No Jobs Found</h3>
							<p className='text-muted-foreground mt-2'>
								There are no open positions matching your criteria.
							</p>
						</div>
					)}

					{isPaginated && meta.totalRecords! > itemLimit && (
						<div className='flex justify-center pt-8'>
							<Pagination meta={meta} onPageChange={handlePageChange} noun='job' />
						</div>
					)}
				</>
			)}
		</div>
	);
}
