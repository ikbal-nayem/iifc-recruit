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
import { Application } from '@/interfaces/application.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import type { Job } from '@/lib/types';

type ApplicationWithJob = Application & { job: Job | undefined };

export function MyApplications() {
	const [data, setData] = React.useState<ApplicationWithJob[]>([]);

	const columns: ColumnDef<ApplicationWithJob>[] = [
		{
			accessorKey: 'job.title',
			header: 'Job Title',
			cell: ({ row }) => {
				const application = row.original;
				return (
					<Link
						href={`/jobseeker/jobs/${application.id}`}
						className='font-medium text-primary hover:underline'
					>
						{application.job?.title}
					</Link>
				);
			},
		},
		{
			accessorKey: 'job.department',
			header: 'Department',
		},
		{
			accessorKey: 'applicationDate',
			header: 'Date Applied',
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.getValue('status') as string;
				return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const renderMobileCard = (application: ApplicationWithJob) => (
		<Card key={application.id} className='mb-4 glassmorphism'>
			<div className='p-4 space-y-2'>
				<Link
					href={`/jobseeker/jobs/${application.id}`}
					className='font-semibold text-lg text-primary hover:underline'
				>
					{application.job?.title}
				</Link>
				<p className='text-sm text-muted-foreground'>{application.job?.department}</p>
				<div className='flex justify-between items-center pt-2'>
					<div>
						<p className='text-xs text-muted-foreground'>Applied on</p>
						<p className='text-sm font-medium'>{application.appliedDate}</p>
					</div>
					<Badge variant={getStatusVariant(application.status)}>{application.status}</Badge>
				</div>
			</div>
		</Card>
	);

	return (
		<div className='space-y-4'>
			{/* Mobile View */}
			<div className='md:hidden'>
				{data.length > 0 ? (
					data.map(renderMobileCard)
				) : (
					<div className='text-center py-16'>
						<p className='text-muted-foreground'>You haven't applied for any jobs yet.</p>
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
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
									You haven't applied for any jobs yet.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{data.length > 0 && (
				<div className='flex items-center justify-center md:justify-end space-x-2 py-4'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}
