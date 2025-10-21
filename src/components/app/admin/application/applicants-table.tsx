'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	RowSelectionState,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { Jobseeker } from '@/interfaces/jobseeker.interface';
import { getStatusVariant } from '@/lib/utils';
import { FileText, UserCheck, UserPlus } from 'lucide-react';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';

type Applicant = Jobseeker & { application: Application };

interface ApplicantsTableProps {
	applicants: Applicant[];
	setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
}

export function ApplicantsTable({ applicants, setApplicants }: ApplicantsTableProps) {
	const { toast } = useToast();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [selectedApplicant, setSelectedApplicant] = React.useState<Jobseeker | null>(null);
	const [bulkAction, setBulkAction] = React.useState<{ type: 'hired' | 'accepted'; count: number } | null>(
		null
	);

	const handleStatusChange = (applicationIds: string[], newStatus: APPLICATION_STATUS) => {
		setApplicants((prevData) =>
			prevData.map((applicant) =>
				applicationIds.includes(applicant.application.id)
					? { ...applicant, application: { ...applicant.application, status: newStatus } }
					: applicant
			)
		);

		toast({
			description: `${applicationIds.length} applicant(s) have been updated to ${newStatus}.`,
			variant: 'success',
		});
		table.resetRowSelection();
	};

	const handleBulkActionConfirm = () => {
		if (!bulkAction) return;
		const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.application.id);
		if (bulkAction.type === 'hired') {
			handleStatusChange(selectedIds, APPLICATION_STATUS.HIRED);
		} else if (bulkAction.type === 'accepted') {
			handleStatusChange(selectedIds, APPLICATION_STATUS.ACCEPTED);
		}
		setBulkAction(null);
	};

	const getActionItems = (applicant: Applicant): ActionItem[] => [
		{
			label: 'View Profile',
			icon: <FileText className='mr-2 h-4 w-4' />,
			onClick: () => setSelectedApplicant(applicant),
		},
		{ isSeparator: true },
		{
			label: 'Mark as Accepted',
			icon: <UserCheck className='mr-2 h-4 w-4' />,
			onClick: () => handleStatusChange([applicant.application.id], APPLICATION_STATUS.ACCEPTED),
		},
		{
			label: 'Mark as Hired',
			icon: <UserPlus className='mr-2 h-4 w-4' />,
			onClick: () => handleStatusChange([applicant.application.id], APPLICATION_STATUS.HIRED),
		},
	];

	const columns: ColumnDef<Applicant>[] = [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label='Select all'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label='Select row'
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'personalInfo',
			header: 'Applicant',
			cell: ({ row }) => {
				const { name, email, avatar } = row.original.personalInfo;
				return (
					<div className='flex items-center gap-3'>
						<Avatar>
							<AvatarImage src={avatar} alt={name} data-ai-hint='avatar' />
							<AvatarFallback>{name?.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<div className='font-medium'>{name}</div>
							<div className='text-sm text-muted-foreground'>{email}</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'application.applicationDate',
			header: 'Date Applied',
		},
		{
			accessorKey: 'application.status',
			header: 'Status',
			cell: ({ row }) => {
				const status = row.original.application.status;
				return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const applicant = row.original;
				return <ActionMenu items={getActionItems(applicant)} />;
			},
		},
	];

	const table = useReactTable({
		data: applicants,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			rowSelection,
		},
	});

	const selectedRowCount = Object.keys(rowSelection).length;

	const renderMobileCard = (applicant: Applicant) => (
		<Card key={applicant.id} className='mb-4 glassmorphism'>
			<div className='p-4 flex justify-between items-start'>
				<div className='flex items-center gap-4'>
					<Avatar>
						<AvatarImage
							src={applicant.personalInfo.avatar}
							alt={applicant.personalInfo.name}
							data-ai-hint='avatar'
						/>
						<AvatarFallback>{applicant.personalInfo.fullName?.charAt(0)}</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-semibold'>{applicant.personalInfo.name}</p>
						<p className='text-sm text-muted-foreground'>Applied: {applicant.application.applicationDate}</p>
						<Badge variant={getStatusVariant(applicant.application.status)} className='mt-2'>
							{applicant.application.status}
						</Badge>
					</div>
				</div>
				<ActionMenu items={getActionItems(applicant)} />
			</div>
		</Card>
	);

	return (
		<>
			<div className='flex flex-col sm:flex-row items-center gap-4'>
				<Input
					placeholder='Filter by applicant name...'
					value={(table.getColumn('personalInfo')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('personalInfo')?.setFilterValue(event.target.value)}
					className='max-w-sm w-full'
				/>
				<Select
					value={(table.getColumn('application_status')?.getFilterValue() as string) ?? 'all'}
					onValueChange={(value) =>
						table.getColumn('application_status')?.setFilterValue(value === 'all' ? null : value)
					}
				>
					<SelectTrigger className='w-full sm:w-[180px]'>
						<SelectValue placeholder='Filter by status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Statuses</SelectItem>
						<SelectItem value='Applied'>Applied</SelectItem>
						<SelectItem value='Screening'>Screening</SelectItem>
						<SelectItem value='Shortlisted'>Shortlisted</SelectItem>
						<SelectItem value='Interview'>Interview</SelectItem>
						<SelectItem value='Offered'>Offered</SelectItem>
						<SelectItem value='Hired'>Hired</SelectItem>
						<SelectItem value='Rejected'>Rejected</SelectItem>
					</SelectContent>
				</Select>
				{selectedRowCount > 0 && (
					<div className='flex items-center gap-2'>
						<Button size='sm' onClick={() => setBulkAction({ type: 'accepted', count: selectedRowCount })}>
							Accept ({selectedRowCount})
						</Button>
						<Button
							size='sm'
							variant='secondary'
							onClick={() => setBulkAction({ type: 'hired', count: selectedRowCount })}
						>
							<UserCheck className='mr-2 h-4 w-4' /> Hire ({selectedRowCount})
						</Button>
					</div>
				)}
			</div>

			{/* Mobile View */}
			<div className='md:hidden mt-4'>
				{applicants.length > 0 ? (
					applicants.map(renderMobileCard)
				) : (
					<div className='text-center py-16'>
						<p className='text-muted-foreground'>No applicants found for this post.</p>
					</div>
				)}
			</div>

			<div className='hidden md:block rounded-md border glassmorphism mt-4'>
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
									No applicants found for this post.
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
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
			<Dialog open={!!selectedApplicant} onOpenChange={(isOpen) => !isOpen && setSelectedApplicant(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					{selectedApplicant && <JobseekerProfileView jobseeker={selectedApplicant} />}
				</DialogContent>
			</Dialog>

			<ConfirmationDialog
				open={!!bulkAction}
				onOpenChange={(isOpen) => !isOpen && setBulkAction(null)}
				title={`Confirm Bulk Action: ${bulkAction?.type.charAt(0).toUpperCase() + bulkAction?.type.slice(1)}`}
				description={`Are you sure you want to mark ${bulkAction?.count} applicant(s) as ${
					bulkAction?.type === 'accepted' ? 'Shortlisted' : bulkAction?.type
				}?`}
				onConfirm={handleBulkActionConfirm}
				variant={bulkAction?.type === 'hired' ? 'warning' : 'default'}
			/>
		</>
	);
}
