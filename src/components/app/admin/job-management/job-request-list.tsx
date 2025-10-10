
'use client';

import * as React from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	SortingState,
	ColumnFiltersState,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { Check, Clock, X } from 'lucide-react';
import type { JobRequest } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ActionItem, ActionMenu } from '@/components/ui/action-menu';

const mockRequests: JobRequest[] = [
	{
		id: 'req1',
		clientOrganization: 'Apex Solutions',
		title: 'Senior Backend Engineer',
		positionType: 'Permanent',
		requestDate: '2024-07-28',
		status: 'Pending',
	},
	{
		id: 'req2',
		clientOrganization: 'Innovatech Ltd.',
		title: 'Data Entry Operator',
		positionType: 'Outsourcing',
		requestDate: '2024-07-27',
		status: 'Approved',
	},
	{
		id: 'req3',
		clientOrganization: 'Synergy Corp',
		title: 'Marketing Manager',
		positionType: 'Permanent',
		requestDate: '2024-07-26',
		status: 'Rejected',
	},
	{
		id: 'req4',
		clientOrganization: 'Apex Solutions',
		title: 'Junior QA Tester',
		positionType: 'Outsourcing',
		requestDate: '2024-07-25',
		status: 'Pending',
	},
];

export function JobRequestList() {
	const [data, setData] = React.useState<JobRequest[]>(mockRequests);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const { toast } = useToast();

	const handleStatusChange = (requestId: string, newStatus: JobRequest['status']) => {
		setData((prevData) =>
			prevData.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
		);
		toast({
			title: 'Request Updated',
			description: `The job request has been ${newStatus.toLowerCase()}.`,
			variant: 'success',
		});
	};

	const getActionItems = (request: JobRequest): ActionItem[] => {
		const items: ActionItem[] = [];
		if (request.status === 'Pending') {
			items.push(
				{
					label: 'Approve',
					icon: <Check className='mr-2 h-4 w-4' />,
					onClick: () => handleStatusChange(request.id, 'Approved'),
				},
				{
					label: 'Reject',
					icon: <X className='mr-2 h-4 w-4' />,
					onClick: () => handleStatusChange(request.id, 'Rejected'),
					variant: 'danger',
				}
			);
		} else {
			items.push({
				label: 'Set to Pending',
				icon: <Clock className='mr-2 h-4 w-4' />,
				onClick: () => handleStatusChange(request.id, 'Pending'),
			});
		}
		return items;
	};

	const columns: ColumnDef<JobRequest>[] = [
		{
			accessorKey: 'title',
			header: 'Job Title',
			cell: ({ row }) => {
				const request = row.original;
				return (
					<div>
						<div className='font-medium'>{request.title}</div>
						<div className='text-sm text-muted-foreground'>{request.clientOrganization}</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'positionType',
			header: 'Position Type',
		},
		{
			accessorKey: 'requestDate',
			header: 'Date Requested',
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.getValue('status') as string;
				const variant =
					status === 'Approved'
						? 'success'
						: status === 'Rejected'
						? 'danger'
						: status === 'Pending'
						? 'warning'
						: 'secondary';
				return <Badge variant={variant as any}>{status}</Badge>;
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const request = row.original;
				return <ActionMenu label='Actions' items={getActionItems(request)} />;
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div className='space-y-4'>
			<Input
				placeholder='Filter by job title or organization...'
				value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
				onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
				className='max-w-sm'
			/>
			<div className='rounded-md border glassmorphism'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									No job requests found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					Next
				</Button>
			</div>
		</div>
	);
}
