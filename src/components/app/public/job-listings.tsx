
'use client';

import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICircular, JobRequestType } from '@/interfaces/job.interface';
import { IOutsourcingZone } from '@/interfaces/master-data.interface';
import { CircularService } from '@/services/api/circular.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, parseISO } from 'date-fns';
import { Briefcase, Building, LayoutGrid, List, Loader2, MapPin, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormSelect } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const initMeta: IMeta = { page: 0, limit: 12, totalRecords: 0 };

interface JobListingsProps {
	isPaginated?: boolean;
	showFilters?: boolean;
	itemLimit?: number;
}

export function JobListings({
	isPaginated = true,
	showFilters = true,
	itemLimit,
}: JobListingsProps) {
	const searchParams = useSearchParams();
	const { toast } = useToast();
	const [data, setData] = useState<ICircular[]>([]);
	const [meta, setMeta] = useState<IMeta>({ ...initMeta, limit: itemLimit || initMeta.limit });
	const [isLoading, setIsLoading] = useState(true);
	const [zones, setZones] = useState<IOutsourcingZone[]>([]);

	const [search, setSearch] = useState(searchParams.get('search') || '');
	const [type, setType] = useState(searchParams.get('type') || 'all');
	const [zone, setZone] = useState(searchParams.get('zone') || 'all');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	const debouncedSearch = useDebounce(search, 500);

	const loadCirculars = useCallback(
		async (page: number) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						searchKey: debouncedSearch,
						...(type !== 'all' && {
							outsourcing: type === JobRequestType.OUTSOURCING,
						}),
						...(zone !== 'all' && { outsourcingZoneId: zone }),
					},
					meta: { page: page, limit: meta.limit },
				};
				const response = await CircularService.search(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast({
					title: 'Error',
					description: 'Failed to load job listings. ' + error.message,
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[debouncedSearch, type, zone, meta.limit, toast]
	);

	useEffect(() => {
		MasterDataService.outsourcingZone
			.get()
			.then((res) => setZones(res.body))
			.catch(() => toast({ description: 'Failed to load zones.', variant: 'danger' }));
	}, [toast]);

	useEffect(() => {
		loadCirculars(0);
	}, [loadCirculars]);

	const handlePageChange = (newPage: number) => {
		loadCirculars(newPage);
	};

	const createQueryString = (params: Record<string, string>) => {
		const newSearchParams = new URLSearchParams(searchParams.toString());
		for (const [key, value] of Object.entries(params)) {
			if (value === 'all' || !value) {
				newSearchParams.delete(key);
			} else {
				newSearchParams.set(key, value);
			}
		}
		return newSearchParams.toString();
	};

	const queryParams = new URLSearchParams(searchParams.toString());

	const renderItem = (item: ICircular, viewMode: 'grid' | 'list') => {
		const deadline = parseISO(item.circularEndDate);
		const daysLeft = differenceInDays(deadline, new Date());
		let deadlineClass = '';
		if (daysLeft <= 3) {
			deadlineClass = 'border-danger/50 animate-pulse-subtle';
		} else if (daysLeft <= 7) {
			deadlineClass = 'border-warning/50';
		}

		if (viewMode === 'list') {
			return (
				<Link href={`/jobs/${item.id}?${queryParams.toString()}`} key={item.id} className='block w-full'>
					<Card
						className={cn(
							'hover:bg-muted/50 transition-colors p-4 flex flex-col md:flex-row justify-between items-start gap-4',
							deadlineClass
						)}
					>
						<div className='flex-1'>
							<p className='font-semibold'>{item.postNameEn}</p>
							<div className='text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 mt-1'>
								<span className='flex items-center gap-1.5'>
									<Building className='h-4 w-4' /> {item.clientOrganizationNameEn}
								</span>
								{item.outsourcingZoneNameEn && (
									<span className='flex items-center gap-1.5'>
										<MapPin className='h-4 w-4' /> {item.outsourcingZoneNameEn}
									</span>
								)}
								<span className='flex items-center gap-1.5'>
									<Briefcase className='h-4 w-4' /> {item.outsourcing ? 'Outsourcing' : 'Permanent'}
								</span>
							</div>
						</div>
						<div className='text-left md:text-right w-full md:w-auto mt-2 md:mt-0'>
							<p className='text-sm font-medium'>
								Deadline:{' '}
								<span
									className={cn(
										daysLeft <= 7 && 'font-bold',
										daysLeft <= 3 ? 'text-danger' : daysLeft <= 7 ? 'text-warning' : ''
									)}
								>
									{daysLeft >= 0 ? `${daysLeft} days left` : 'Expired'}
								</span>
							</p>
							<p className='text-xs text-muted-foreground'>
								Published: {parseISO(item.circularPublishDate).toLocaleDateString()}
							</p>
						</div>
					</Card>
				</Link>
			);
		}

		return (
			<Link href={`/jobs/${item.id}?${queryParams.toString()}`} key={item.id}>
				<Card className={cn('glassmorphism card-hover h-full flex flex-col', deadlineClass)}>
					<CardHeader>
						<CardTitle className='font-headline text-xl leading-tight group-hover:text-primary transition-colors'>
							{item.postNameEn}
						</CardTitle>
						<CardDescription className='flex items-center gap-2 pt-1'>
							<Building className='h-4 w-4' /> {item.clientOrganizationNameEn}
						</CardDescription>
					</CardHeader>
					<CardContent className='flex-grow space-y-2 text-sm'>
						<div className='flex items-center gap-2 text-muted-foreground'>
							<MapPin className='h-4 w-4' />
							<span>{item.outsourcingZoneNameEn || 'Not specified'}</span>
						</div>
						<div className='flex items-center gap-2 text-muted-foreground'>
							<Briefcase className='h-4 w-4' />
							<span>{item.outsourcing ? 'Outsourcing' : 'Permanent'}</span>
						</div>
					</CardContent>
					<div className='p-4 pt-0 text-xs text-center font-medium'>
						<p className={cn(daysLeft <= 7 && 'font-bold', daysLeft <= 3 ? 'text-danger' : 'text-warning')}>
							Deadline: {daysLeft} days left
						</p>
					</div>
				</Card>
			</Link>
		);
	};

	return (
		<div className='space-y-6'>
			{showFilters && (
				<Card className='p-4 border rounded-lg glassmorphism'>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'>
						<div className='relative md:col-span-2'>
							<label htmlFor='search' className='text-sm font-medium text-muted-foreground'>
								Search by keyword
							</label>
							<Search className='absolute left-3 bottom-3 h-4 w-4 text-muted-foreground' />
							<Input
								id='search'
								placeholder='Job title, company...'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='pl-10 h-11'
							/>
						</div>
						<div>
							<FormSelect
								control={undefined as any}
								name='type'
								label='Job Type'
								options={[
									{ label: 'All Types', value: 'all' },
									{ label: 'Permanent', value: JobRequestType.PERMANENT },
									{ label: 'Outsourcing', value: JobRequestType.OUTSOURCING },
								]}
								onValueChange={(value) => setType(value as string)}
								value={type}
							/>
						</div>
						<div>
							<FormSelect
								control={undefined as any}
								name='zone'
								label='Outsourcing Zone'
								options={[{ id: 'all', nameEn: 'All Zones' }, ...zones]}
								getOptionValue={(opt: any) => opt.id!}
								getOptionLabel={(opt: any) => opt.nameEn}
								onValueChange={(value) => setZone(value as string)}
								value={zone}
								disabled={type !== JobRequestType.OUTSOURCING}
							/>
						</div>
					</div>
				</Card>
			)}

			{isLoading ? (
				<div className='space-y-4'>
					<Skeleton className='h-8 w-full' />
					<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{[...Array(6)].map((_, i) => (
							<Skeleton key={i} className='h-56 w-full' />
						))}
					</div>
				</div>
			) : (
				<>
					<div className='flex justify-between items-center'>
						<p className='text-sm font-medium text-muted-foreground'>
							Showing <span className='font-bold text-foreground'>{data.length}</span> of{' '}
							<span className='font-bold text-foreground'>{meta.totalRecords}</span> jobs
						</p>
						<div className='flex items-center gap-1 border p-1 rounded-md bg-background'>
							<Button
								variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
								size='icon'
								className='h-8 w-8'
								onClick={() => setViewMode('grid')}
							>
								<LayoutGrid className='h-4 w-4' />
							</Button>
							<Button
								variant={viewMode === 'list' ? 'secondary' : 'ghost'}
								size='icon'
								className='h-8 w-8'
								onClick={() => setViewMode('list')}
							>
								<List className='h-4 w-4' />
							</Button>
						</div>
					</div>

					{data.length > 0 ? (
						<div
							className={cn(
								'grid gap-6',
								viewMode === 'list' && 'grid-cols-1',
								viewMode === 'grid' && 'md:grid-cols-2 lg:grid-cols-3'
							)}
						>
							{data.map((item) => renderItem(item, viewMode))}
						</div>
					) : (
						<div className='text-center py-16'>
							<h3 className='text-xl font-semibold'>No Jobs Found</h3>
							<p className='text-muted-foreground mt-2'>
								Try adjusting your search filters to find what you're looking for.
							</p>
						</div>
					)}
					{isPaginated && meta && meta.totalRecords! > 0 && meta.limit < meta.totalRecords! && (
						<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='job' />
					)}
				</>
			)}
		</div>
	);
}
