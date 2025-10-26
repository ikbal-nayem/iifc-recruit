
'use client';

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { JobseekerProfileView } from '@/components/app/jobseeker/jobseeker-profile-view';
import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileText, Send, UserX } from 'lucide-react';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { useDebounce } from '@/hooks/use-debounce';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { makePreviewURL } from '@/lib/file-oparations';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

export function JobseekerManagement() {
	const [data, setData] = React.useState<JobseekerSearch[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [selectedJobseeker, setSelectedJobseeker] = React.useState<JobseekerSearch | null>(null);
	const { toast } = useToast();
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const loadJobseekers = React.useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { searchKey: search },
					meta: { page, limit: meta.limit },
				};
				const response = await JobseekerProfileService.search(payload);
				setData(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast({
					title: 'Error',
					description: error.message || 'Failed to load jobseekers.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	React.useEffect(() => {
		loadJobseekers(0, debouncedSearch);
	}, [debouncedSearch, loadJobseekers]);

	const handlePageChange = (newPage: number) => {
		loadJobseekers(newPage, debouncedSearch);
	};

	const getActionItems = (jobseeker: JobseekerSearch): ActionItem[] => [
		{
			label: 'View Full Profile',
			icon: <FileText className='mr-2 h-4 w-4' />,
			onClick: () => setSelectedJobseeker(jobseeker),
		},
		{
			label: 'Contact',
			icon: <Send className='mr-2 h-4 w-4' />,
			onClick: () => toast({ description: `Contacting ${jobseeker.fullName}... (not implemented)` }),
		},
		{ isSeparator: true },
		{
			label: 'Deactivate',
			icon: <UserX className='mr-2 h-4 w-4' />,
			onClick: () => alert('Deactivating... (not implemented)'),
			variant: 'danger',
		},
	];

	const columns: ColumnDef<JobseekerSearch>[] = [
		{
			accessorKey: 'fullName',
			header: 'Name',
			cell: ({ row }) => {
				const jobseeker = row.original;
				const { fullName, email, profileImage, firstName, lastName } = jobseeker;
				return (
					<div className='flex items-center gap-3'>
						<Avatar>
							<AvatarImage src={makePreviewURL(profileImage)} alt={fullName} data-ai-hint='avatar' />
							<AvatarFallback>
								{firstName?.charAt(0)}
								{lastName?.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className='font-medium'>{fullName}</div>
							<div className='text-sm text-muted-foreground'>{email}</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'phone',
			header: 'Phone',
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const jobseeker = row.original;
				return <ActionMenu label='Actions' items={getActionItems(jobseeker)} />;
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
		manualPagination: true,
		pageCount: meta.totalPageCount,
	});

	const renderMobileCard = (jobseeker: JobseekerSearch) => (
		<Card key={jobseeker.userId} className='mb-4 glassmorphism'>
			<div className='p-4 flex justify-between items-start'>
				<div className='flex items-center gap-4'>
					<Avatar>
						<AvatarImage
							src={makePreviewURL(jobseeker.profileImage)}
							alt={jobseeker.fullName}
							data-ai-hint='avatar'
						/>
						<AvatarFallback>
							{jobseeker.firstName?.charAt(0)}
							{jobseeker.lastName?.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-semibold'>{jobseeker.fullName}</p>
						<p className='text-sm text-muted-foreground'>{jobseeker.email}</p>
						<p className='text-sm text-muted-foreground'>{jobseeker.phone}</p>
					</div>
				</div>
				<ActionMenu items={getActionItems(jobseeker)} />
			</div>
		</Card>
	);

	return (
		<div className='space-y-4'>
			<Input
				placeholder='Filter by name, email, or phone...'
				value={searchQuery}
				onChange={(event) => setSearchQuery(event.target.value)}
				className='w-full md:max-w-sm'
			/>
			{/* Mobile View */}
			<div className='md:hidden'>
				{isLoading ? (
					[...Array(5)].map((_, i) => <Skeleton key={i} className='h-24 w-full' />)
				) : data.length > 0 ? (
					data.map(renderMobileCard)
				) : (
					<div className='text-center py-16'>
						<p className='text-muted-foreground'>No jobseekers found.</p>
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
							[...Array(meta.limit)].map((_, i) => (
								<TableRow key={i}>
									<TableCell colSpan={columns.length}>
										<Skeleton className='h-10 w-full' />
									</TableCell>
								</TableRow>
							))
						) : table.getRowModel().rows?.length ? (
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
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			{meta && meta.totalRecords && meta.totalRecords > 0 ? (
				<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={'jobseeker'} />
			) : null}

			<Dialog open={!!selectedJobseeker} onOpenChange={(isOpen) => !isOpen && setSelectedJobseeker(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					{selectedJobseeker && <JobseekerProfileView jobseekerId={selectedJobseeker.userId} />}
				</DialogContent>
			</Dialog>
		</div>
	);
}
