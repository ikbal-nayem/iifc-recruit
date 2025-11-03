
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
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Application } from '@/interfaces/application.interface';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { ApplicationService } from '@/services/api/application.service';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { JobCircularDetails } from '../../public/job-circular-details';

const initMeta: IMeta = { page: 0, limit: 10 };

export function MyApplications() {
	const { toast } = useToast();
	const [data, setData] = React.useState<Application[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = React.useState(true);
	const [selectedJobId, setSelectedJobId] = React.useState<string | null>(null);

	const loadApplications = React.useCallback(
		async (page: number) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					meta: { page: page, limit: meta.limit },
				};
				const response = await ApplicationService.getByApplicant(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast({
					title: 'Error',
					description: error.message || 'Failed to load your applications.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	React.useEffect(() => {
		loadApplications(0);
	}, [loadApplications]);

	const handlePageChange = (newPage: number) => {
		loadApplications(newPage);
	};

	const columns: ColumnDef<Application>[] = [
		{
			accessorKey: 'requestedPost.post.nameEn',
			header: 'Job Title',
			cell: ({ row }) => {
				const application = row.original;
				return (
					<Link
						href={`/jobseeker/jobs/${application.requestedPostId}`}
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
			cell: ({ row }) => {
				return (
					<Button variant='ghost' size='sm' onClick={() => setSelectedJobId(row.original.requestedPostId)}>
						<Eye className='h-4 w-4 mr-2' /> View
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
					href={`/jobseeker/jobs/${application.requestedPostId}`}
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
			{/* Mobile View */}
			<div className='md:hidden'>
				{isLoading ? (
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
						{isLoading ? (
							[...Array(5)].map((_, i) => (
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

			{meta && meta.totalRecords! > 0 && (
				<div className='flex items-center justify-center md:justify-end space-x-2 py-4'>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='application' />
				</div>
			)}

			<Dialog open={!!selectedJobId} onOpenChange={(isOpen) => !isOpen && setSelectedJobId(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto p-0'>
					<JobCircularDetails circularId={selectedJobId!} isReadOnly={true} />
				</DialogContent>
			</Dialog>
		</div>
	);
}
