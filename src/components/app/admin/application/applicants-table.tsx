
'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
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
import { Card, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { IMeta } from '@/interfaces/common.interface';
import { JobRequestedPostStatus } from '@/interfaces/job.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { getStatusVariant } from '@/lib/utils';
import { FileText, Loader2, UserCheck, UserPlus } from 'lucide-react';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';

interface ApplicantsTableProps {
	applicants: Application[];
	setApplicants: React.Dispatch<React.SetStateAction<Application[]>>;
	statuses: EnumDTO[];
	isLoading: boolean;
	meta: IMeta;
	onPageChange: (page: number) => void;
	requestedPostStatus?: JobRequestedPostStatus;
}

export function ApplicantsTable({
	applicants,
	setApplicants,
	statuses,
	isLoading,
	meta,
	onPageChange,
	requestedPostStatus,
}: ApplicantsTableProps) {
	const { toast } = useToast();
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [selectedApplicant, setSelectedApplicant] = React.useState<JobseekerSearch | null>(null);
	const [bulkAction, setBulkAction] = React.useState<{
		type: APPLICATION_STATUS.HIRED | APPLICATION_STATUS.ACCEPTED;
		count: number;
	} | null>(null);

	const handleStatusChange = (applicationIds: string[], newStatus: APPLICATION_STATUS) => {
		setApplicants((prevData) =>
			prevData.map((applicant) =>
				applicationIds.includes(applicant.id) ? { ...applicant, status: newStatus } : applicant
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
		const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original.id);
		handleStatusChange(selectedIds, bulkAction.type);
		setBulkAction(null);
	};

	const getActionItems = (applicant: Application): ActionItem[] => {
		const items: ActionItem[] = [
			{
				label: 'View Profile',
				icon: <FileText className='mr-2 h-4 w-4' />,
				onClick: () => setSelectedApplicant(applicant.applicant as JobseekerSearch),
			},
			{ isSeparator: true },
			{
				label: 'Mark as Accepted',
				icon: <UserCheck className='mr-2 h-4 w-4' />,
				onClick: () => handleStatusChange([applicant.id], APPLICATION_STATUS.ACCEPTED),
			},
		];
		if (requestedPostStatus !== JobRequestedPostStatus.PENDING) {
			items.push({
				label: 'Mark as Hired',
				icon: <UserPlus className='mr-2 h-4 w-4' />,
				onClick: () => handleStatusChange([applicant.id], APPLICATION_STATUS.HIRED),
			});
		}
		return items;
	};

	const columns: ColumnDef<Application>[] = [
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
			accessorKey: 'applicant',
			header: 'Applicant',
			cell: ({ row }) => {
				const { fullName, email, profileImage, firstName, lastName, phone } = row.original
					.applicant as JobseekerSearch;
				return (
					<div className='flex items-center gap-3'>
						<Avatar>
							<AvatarImage src={profileImage?.filePath} />
							<AvatarFallback>
								{firstName?.[0]}
								{lastName?.[0]}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className='font-semibold'>{fullName}</p>
							<p className='text-xs text-muted-foreground'>{email}</p>
							<p className='text-xs text-muted-foreground'>{phone}</p>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'applicationDate',
			header: 'Date Applied',
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
				const applicant = row.original;
				return <ActionMenu items={getActionItems(applicant)} />;
			},
		},
	];

	const table = useReactTable({
		data: applicants,
		columns,
		getCoreRowModel: getCoreRowModel(),
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

	const renderMobileCard = (applicant: Application) => {
		const { fullName, profileImage, firstName, lastName } = applicant.applicant as JobseekerSearch;
		return (
			<Card key={applicant.id} className='mb-2 p-3 flex justify-between items-start glassmorphism'>
				<div className='flex items-center gap-3'>
					<Avatar>
						<AvatarImage src={profileImage?.filePath} alt={fullName} data-ai-hint='avatar' />
						<AvatarFallback>
							{firstName?.[0]}
							{lastName?.[0]}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-semibold text-sm'>{fullName}</p>
						<p className='text-xs text-muted-foreground'>Applied: {applicant.applicationDate}</p>
						<Badge variant={getStatusVariant(applicant.status)} className='mt-2 text-xs'>
							{applicant.status}
						</Badge>
					</div>
				</div>
				<ActionMenu items={getActionItems(applicant)} />
			</Card>
		);
	};

	return (
		<>
			<div className='flex flex-col sm:flex-row items-center gap-4'>
				<Input
					placeholder='Filter by applicant name...'
					value={(table.getColumn('applicant')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('applicant')?.setFilterValue(event.target.value)}
					className='max-w-sm w-full'
				/>
				<Select
					value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
					onValueChange={(value) => table.getColumn('status')?.setFilterValue(value === 'all' ? null : value)}
				>
					<SelectTrigger className='w-full sm:w-[180px]'>
						<SelectValue placeholder='Filter by status' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>All Statuses</SelectItem>
						{statuses.map((status) => (
							<SelectItem key={status.value} value={status.value}>
								{status.nameEn}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{selectedRowCount > 0 && (
					<div className='flex items-center gap-2'>
						<Button
							size='sm'
							variant='lite-success'
							onClick={() => setBulkAction({ type: APPLICATION_STATUS.ACCEPTED, count: selectedRowCount })}
						>
							Accept ({selectedRowCount})
						</Button>
						{requestedPostStatus !== JobRequestedPostStatus.PENDING && (
							<Button
								size='sm'
								variant='lite-warning'
								onClick={() => setBulkAction({ type: APPLICATION_STATUS.HIRED, count: selectedRowCount })}
							>
								<UserCheck className='mr-2 h-4 w-4' /> Hire ({selectedRowCount})
							</Button>
						)}
					</div>
				)}
			</div>

			{/* Mobile View */}
			<div className='md:hidden mt-4 space-y-2'>
				{isLoading ? (
					<Loader2 className='mx-auto h-6 w-6 animate-spin' />
				) : applicants.length > 0 ? (
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
										<TableHead key={header.id} className='py-2 font-bold'>
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
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									<Loader2 className='mx-auto h-6 w-6 animate-spin' />
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className='py-2'>
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
			{meta.totalRecords && meta.totalRecords > 0 ? (
				<CardFooter>
					<Pagination meta={meta} isLoading={isLoading} onPageChange={onPageChange} noun={'Applicant'} />
				</CardFooter>
			) : null}
			<Dialog open={!!selectedApplicant} onOpenChange={(isOpen) => !isOpen && setSelectedApplicant(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					{selectedApplicant && <JobseekerProfileView jobseekerId={selectedApplicant.userId} />}
				</DialogContent>
			</Dialog>

			<ConfirmationDialog
				open={!!bulkAction}
				onOpenChange={(isOpen) => !isOpen && setBulkAction(null)}
				title={`Confirm Bulk Action: ${bulkAction?.type === APPLICATION_STATUS.ACCEPTED ? 'Accept' : 'Hire'}`}
				description={`Are you sure you want to mark ${bulkAction?.count} applicant(s) as ${
					bulkAction?.type === APPLICATION_STATUS.ACCEPTED ? 'Accepted' : 'Hired'
				}?`}
				onConfirm={handleBulkActionConfirm}
				variant={bulkAction?.type === APPLICATION_STATUS.HIRED ? 'warning' : 'default'}
			/>
		</>
	);
}
