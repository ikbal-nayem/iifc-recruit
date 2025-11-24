
'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FormSelect } from '@/components/ui/form-select';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes.constant';
import { toast } from '@/hooks/use-toast';
import { Application } from '@/interfaces/application.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { ApplicationService } from '@/services/api/application.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { format } from 'date-fns';
import { Eye, Loader2 } from 'lucide-react';
import { JobCircularDetails } from '../public/job-circular-details';

const initMeta: IMeta = { page: 0, limit: 10 };

interface MyApplicationsProps {
	initialStatusFilter?: string;
}

export function MyApplications({ initialStatusFilter = 'all' }: MyApplicationsProps) {
	const [data, setData] = React.useState<Application[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = React.useState(true);
	const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null);
	const [statuses, setStatuses] = React.useState<EnumDTO[]>([]);
	const [statusFilter, setStatusFilter] = React.useState<string>(initialStatusFilter);

	React.useEffect(() => {
		MasterDataService.getEnum('application-status')
			.then((res) => {
				setStatuses(res.body as EnumDTO[]);
			})
			.catch(() => {
				toast.error({ description: 'Failed to load application statuses.' });
			});
	}, []);

	const loadApplications = React.useCallback(
		async (page: number, status: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					meta: { page: page, limit: meta.limit },
					body: {
						...(status !== 'all' && { status: status }),
					},
				};
				const response = await ApplicationService.getByApplicant(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast.error({
					description: error.message || 'Failed to load your applications.',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	React.useEffect(() => {
		loadApplications(0, statusFilter);
	}, [loadApplications, statusFilter]);

	const handlePageChange = (newPage: number) => {
		loadApplications(newPage, statusFilter);
	};

	const columns: ColumnDef<Application>[] = [
		{
			accessorKey: 'requestedPost.post.nameEn',
			header: 'Job Title',
			cell: ({ row }) => {
				const application = row.original;
				return (
					<Link
						href={ROUTES.JOB_SEEKER.JOB_DETAILS(application.requestedPostId)}
						className='font-medium text-primary hover:underline'
					>
						{application.requestedPost?.post?.nameEn}
					</Link>
				);
			},
		},
		{
			accessorKey: 'requestedPost.jobRequest.clientOrganization.nameEn',
			header: 'Organization',
		},
		{
			accessorKey: 'appliedDate',
			header: 'Date Applied',
			cell: ({ row }) => {
				return format(new Date(row.original.appliedDate), 'dd MMM, yyyy');
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const { status, statusDTO } = row.original;
				return <Badge variant={getStatusVariant(status)}>{statusDTO.nameEn}</Badge>;
			},
		},
		{
			id: 'actions',
			size: 50,
			cell: ({ row }) => {
				return (
					<Button
						size='icon'
						variant='outline'
						className='float-end'
						onClick={() => setSelectedJobId(row.original.requestedPostId)}
					>
						<Eye className='h-4 w-4' />
					</Button>
				);
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: meta.totalPageCount,
	});

	const renderMobileCard = (application: Application) => (
		<Card key={application.id} className='mb-4 glassmorphism'>
			<div className='p-4 space-y-2'>
				<Link
					href={ROUTES.JOB_SEEKER.JOB_DETAILS(application.requestedPostId)}
					className='font-semibold text-lg text-primary hover:underline'
				>
					{application.requestedPost?.post?.nameEn}
				</Link>
				<p className='text-sm text-muted-foreground'>
					{application.requestedPost?.jobRequest?.clientOrganization?.nameEn}
				</p>
				<div className='flex justify-between items-center pt-2'>
					<div>
						<p className='text-xs text-muted-foreground'>Applied on</p>
						<p className='text-sm font-medium'>{format(new Date(application.appliedDate), 'dd MMM, yyyy')}</p>
					</div>
					<Badge variant={getStatusVariant(application.status)}>{application.statusDTO.nameEn}</Badge>
				</div>
				<div className='pt-2'>
					<Button
						variant='outline'
						size='sm'
						className='w-full'
						onClick={() => setSelectedJobId(application.requestedPostId)}
					>
						<Eye className='h-4 w-4 mr-2' /> View Details
					</Button>
				</div>
			</div>
		</Card>
	);

	const renderSkeletonCard = (key: number) => (
		<Card key={key} className='mb-4 glassmorphism p-4 space-y-3'>
			<Skeleton className='h-6 w-3/4' />
			<Skeleton className='h-4 w-1/2' />
			<div className='flex justify-between items-center pt-2'>
				<div className='space-y-2'>
					<Skeleton className='h-3 w-16' />
					<Skeleton className='h-4 w-24' />
				</div>
				<Skeleton className='h-6 w-20 rounded-full' />
			</div>
		</Card>
	);

	return (
		<div className='space-y-4'>
			<div className='w-full max-w-xs'>
				<FormSelect
					name='statusFilter'
					label='Filter by Status'
					placeholder='Filter by status...'
					value={statusFilter}
					onValueChange={(value) => setStatusFilter(value || 'all')}
					options={[{ value: 'all', nameEn: 'All Statuses' }, ...statuses]}
					getOptionLabel={(option) => option.nameEn}
					getOptionValue={(option) => option.value}
				/>
			</div>

			<div className='relative'>
				{isLoading && data.length > 0 && (
					<div className='absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10'>
						<Loader2 className='h-8 w-8 animate-spin text-primary' />
					</div>
				)}

				{/* Mobile View */}
				<div className='md:hidden'>
					{isLoading && data.length === 0 ? (
						[...Array(3)].map((_, i) => renderSkeletonCard(i))
					) : data.length > 0 ? (
						data.map(renderMobileCard)
					) : (
						<div className='text-center py-16'>
							<p className='text-muted-foreground'>You haven&apos;t applied for any jobs yet.</p>
						</div>
					)}
				</div>

				{/* Desktop View */}
				<div className='hidden md:block rounded-md border glassmorphism'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoading && data.length === 0 ? (
								[...Array(initMeta.limit)].map((_, i) => (
									<TableRow key={i}>
										<TableCell colSpan={columns.length}>
											<Skeleton className='h-8 w-full' />
										</TableCell>
									</TableRow>
								))
							) : table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className='h-24 text-center'>
										You haven&apos;t applied for any jobs yet.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{meta && meta.totalRecords && meta.totalRecords > 0 ? (
				<div className='flex items-center justify-center md:justify-end space-x-2 py-4'>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='application' />
				</div>
			) : null}

			<Dialog open={!!selectedJobId} onOpenChange={(isOpen) => !isOpen && setSelectedJobId(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto p-0'>
					{selectedJobId && <JobCircularDetails circularId={selectedJobId} isReadOnly={true} />}
				</DialogContent>
			</Dialog>
		</div>
	);
}
