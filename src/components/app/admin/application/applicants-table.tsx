
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
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';
import { IMeta } from '@/interfaces/common.interface';
import { JobRequestedPostStatus } from '@/interfaces/job.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { FileText, Loader2, RotateCcw, UserCheck, UserPlus, Calendar as CalendarIcon, Briefcase } from 'lucide-react';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';
import { cn } from '@/lib/utils';
import { format, formatDate } from 'date-fns';
import { getStatusVariant } from '@/lib/color-mapping';
import { DATE_FORMAT } from '@/constants/common.constant';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { useToast } from '@/hooks/use-toast';

interface ApplicantsTableProps {
	applicants: Application[];
	updateApplication: (updatedApplicants: Application[]) => Promise<any>;
	isLoading: boolean;
	meta: IMeta;
	onPageChange: (page: number) => void;
	requestedPostStatus?: JobRequestedPostStatus;
}

const interviewSchema = z.object({
	interviewDate: z.string().min(1, 'Interview date is required.'),
	interviewTime: z.string().min(1, 'Interview time is required.'),
});
type InterviewFormValues = z.infer<typeof interviewSchema>;

export function ApplicantsTable({
	applicants,
	updateApplication,
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
		type: APPLICATION_STATUS.HIRED | APPLICATION_STATUS.ACCEPTED | APPLICATION_STATUS.INTERVIEW;
		count: number;
	} | null>(null);
	const [isInterviewModalOpen, setIsInterviewModalOpen] = React.useState(false);

	const interviewForm = useForm<InterviewFormValues>({
		resolver: zodResolver(interviewSchema),
	});

	const handleStatusChange = async (
		applications: Application[],
		newStatus: APPLICATION_STATUS,
		details?: { interviewDate?: string; interviewTime?: string }
	) => {
		const updatedApplications = applications.map((application) => ({
			...application,
			status: newStatus,
			...(newStatus === APPLICATION_STATUS.INTERVIEW &&
				details && {
					interviewDate: format(
						new Date(`${details.interviewDate}T${details.interviewTime}`),
						"yyyy-MM-dd'T'HH:mm:ss"
					),
				}),
		}));
		const resp = await updateApplication(updatedApplications);
		if (resp) {
			table.resetRowSelection();
		}
	};

	const handleBulkActionConfirm = () => {
		if (!bulkAction) return;
		const selected = table.getSelectedRowModel().rows.map((row) => row.original);
		if (bulkAction.type === APPLICATION_STATUS.INTERVIEW) {
			setIsInterviewModalOpen(true);
		} else {
			handleStatusChange(selected, bulkAction.type);
		}
		setBulkAction(null);
	};

	const handleInterviewScheduleSubmit = (values: InterviewFormValues) => {
		const selected = table.getSelectedRowModel().rows.map((row) => row.original);
		handleStatusChange(selected, APPLICATION_STATUS.INTERVIEW, values);
		setIsInterviewModalOpen(false);
		toast({
			title: 'Interview Scheduled',
			description: `Interview has been scheduled for ${selected.length} applicant(s).`,
			variant: 'success',
		});
	};

	const getActionItems = (application: Application): ActionItem[] => {
		const items: ActionItem[] = [
			{
				label: 'View Profile',
				icon: <FileText className='mr-2 h-4 w-4' />,
				onClick: () => setSelectedApplicant(application.applicant as JobseekerSearch),
			},
			{ isSeparator: true },
		];

		if (application.status === APPLICATION_STATUS.ACCEPTED) {
			items.push({
				label: 'Revert to Applied',
				icon: <RotateCcw className='mr-2 h-4 w-4' />,
				onClick: () => handleStatusChange([application], APPLICATION_STATUS.APPLIED),
			});
		} else {
			items.push({
				label: 'Mark as Accepted',
				icon: <UserCheck className='mr-2 h-4 w-4' />,
				onClick: () => handleStatusChange([application], APPLICATION_STATUS.ACCEPTED),
			});
		}

		if (requestedPostStatus !== JobRequestedPostStatus.PENDING) {
			items.push({
				label: 'Mark as Hired',
				icon: <UserPlus className='mr-2 h-4 w-4' />,
				onClick: () => handleStatusChange([application], APPLICATION_STATUS.HIRED),
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
			accessorKey: 'appliedDate',
			header: 'Date Applied',
			cell: ({ row }) => {
				const { appliedDate } = row.original;
				return <span>{formatDate(appliedDate, DATE_FORMAT.DISPLAY_DATE)}</span>;
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }) => {
				const { status, statusDTO, interviewDate } = row.original;
				return (
					<div className='flex flex-col gap-1'>
						<Badge variant={getStatusVariant(status)}>{statusDTO.nameEn}</Badge>
						{status === APPLICATION_STATUS.INTERVIEW && interviewDate && (
							<span className='text-xs text-muted-foreground'>
								{format(new Date(interviewDate), 'PPp')}
							</span>
						)}
					</div>
				);
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
						<p className='text-xs text-muted-foreground'>
							Applied: {formatDate(applicant.appliedDate, DATE_FORMAT.DISPLAY_DATE)}
						</p>
						<Badge variant={getStatusVariant(applicant.status)} className='mt-2 text-xs'>
							{applicant.statusDTO.nameEn}
						</Badge>
						{applicant.status === APPLICATION_STATUS.INTERVIEW && applicant.interviewDate && (
							<p className='text-xs text-muted-foreground mt-1'>
								{format(new Date(applicant.interviewDate), 'PPp')}
							</p>
						)}
					</div>
				</div>
				<ActionMenu items={getActionItems(applicant)} />
			</Card>
		);
	};

	return (
		<div className='space-y-4'>
			<div className='flex flex-col sm:flex-row items-center gap-4'>
				<Input
					placeholder='Filter by applicant name...'
					value={(table.getColumn('applicant')?.getFilterValue() as string) ?? ''}
					onChange={(event) => table.getColumn('applicant')?.setFilterValue(event.target.value)}
					className='max-w-sm w-full'
				/>
				{selectedRowCount > 0 && (
					<div className='flex items-center gap-2'>
						<Button
							size='sm'
							variant='lite-success'
							onClick={() => setBulkAction({ type: APPLICATION_STATUS.ACCEPTED, count: selectedRowCount })}
						>
							Accept ({selectedRowCount})
						</Button>
						{requestedPostStatus === JobRequestedPostStatus.PROCESSING && (
							<Button
								size='sm'
								variant='lite-info'
								onClick={() => setBulkAction({ type: APPLICATION_STATUS.INTERVIEW, count: selectedRowCount })}
							>
								<CalendarIcon className='mr-2 h-4 w-4' /> Call for Interview ({selectedRowCount})
							</Button>
						)}
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
			<div className='md:hidden space-y-2'>
				{isLoading && !applicants.length ? (
					<div className='text-center py-16'>
						<Loader2 className='mx-auto h-6 w-6 animate-spin' />
					</div>
				) : applicants.length > 0 ? (
					applicants.map(renderMobileCard)
				) : (
					<div className='text-center py-16'>
						<p className='text-muted-foreground'>No applicants found for this post.</p>
					</div>
				)}
			</div>

			{/* Desktop View */}
			<Card className='hidden md:block rounded-md border glassmorphism'>
				<CardContent className='p-0'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} className='py-3 font-bold'>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody
							className={cn(
								'transition-opacity duration-300',
								isLoading ? 'opacity-50' : 'opacity-100'
							)}
						>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className='py-3'>
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
				</CardContent>
				{meta.totalRecords && meta.totalRecords > 0 ? (
					<CardFooter className='py-4'>
						<Pagination meta={meta} isLoading={isLoading} onPageChange={onPageChange} noun={'Applicant'} />
					</CardFooter>
				) : null}
			</Card>
			<Dialog open={!!selectedApplicant} onOpenChange={(isOpen) => !isOpen && setSelectedApplicant(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					{selectedApplicant && <JobseekerProfileView jobseekerId={selectedApplicant.userId} />}
				</DialogContent>
			</Dialog>

			<ConfirmationDialog
				open={!!bulkAction && bulkAction.type !== APPLICATION_STATUS.INTERVIEW}
				onOpenChange={(isOpen) => !isOpen && setBulkAction(null)}
				title={`Confirm Bulk Action: ${
					bulkAction?.type === APPLICATION_STATUS.ACCEPTED ? 'Accept' : 'Hire'
				}`}
				description={`Are you sure you want to mark ${bulkAction?.count} applicant(s) as ${
					bulkAction?.type === APPLICATION_STATUS.ACCEPTED ? 'Accepted' : 'Hired'
				}?`}
				onConfirm={handleBulkActionConfirm}
				variant={bulkAction?.type === APPLICATION_STATUS.HIRED ? 'warning' : 'default'}
			/>
			<Dialog open={isInterviewModalOpen} onOpenChange={setIsInterviewModalOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Schedule Interview</DialogTitle>
					</DialogHeader>
					<Form {...interviewForm}>
						<form
							onSubmit={interviewForm.handleSubmit(handleInterviewScheduleSubmit)}
							className='space-y-4 py-4'
						>
							<FormDatePicker
								control={interviewForm.control}
								name='interviewDate'
								label='Interview Date'
								required
							/>
							<FormInput
								control={interviewForm.control}
								name='interviewTime'
								label='Interview Time'
								type='time'
								required
							/>
							<DialogFooter>
								<Button type='button' variant='ghost' onClick={() => setIsInterviewModalOpen(false)}>
									Cancel
								</Button>
								<Button type='submit'>Schedule</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
