'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormMultiSelect } from '@/components/ui/form-multi-select';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { makePreviewURL } from '@/lib/file-oparations';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { getOutsourcingCategoriesAsync, getPostOutsourcingAsync, getSkillsAsync } from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Loader2, Search, UserPlus } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';

const filterSchema = z.object({
	skillIds: z.array(z.string()).optional(),
	outsourcingCategoryId: z.string().optional(),
	postId: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface ApplicantListManagerProps {
	onApply: (applicants: JobseekerSearch[], onSuccess?: () => void) => void;
}

const initMeta: IMeta = { page: 0, limit: 50, totalRecords: 0 };

export function ApplicantListManager({ onApply }: ApplicantListManagerProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [jobseekers, setJobseekers] = useState<JobseekerSearch[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [selectedJobseeker, setSelectedJobseeker] = React.useState<JobseekerSearch | null>(null);

	const [textSearch, setTextSearch] = useState('');
	const debouncedTextSearch = useDebounce(textSearch, 500);

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [showConfirmation, setShowConfirmation] = useState(false);

	const filterForm = useForm<FilterFormValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			skillIds: [],
			outsourcingCategoryId: '',
			postId: '',
		},
	});

	const watchedSkillIds = filterForm.watch('skillIds');
	const watchedCategoryId = filterForm.watch('outsourcingCategoryId');
	const watchedPostId = filterForm.watch('postId');

	const searchApplicants = useCallback(
		async (page: number, searchCriteria: Partial<FilterFormValues & { searchKey: string }>) => {
			setIsLoading(true);
			try {
				const response = await JobseekerProfileService.search({
					body: searchCriteria,
					meta: { page: page, limit: meta.limit },
				});
				setJobseekers(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				toast.error({
					description: error.message || 'Could not fetch jobseekers.',
				});
				setJobseekers([]);
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	useEffect(() => {
		searchApplicants(0, {
			searchKey: debouncedTextSearch,
			skillIds: watchedSkillIds,
			outsourcingCategoryId: watchedCategoryId,
			postId: watchedPostId,
		});
	}, [debouncedTextSearch, watchedSkillIds, watchedCategoryId, watchedPostId, searchApplicants]);

	const columns: ColumnDef<JobseekerSearch>[] = [
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
			accessorKey: 'fullName',
			header: 'Applicant',
			cell: ({ row }) => {
				const { fullName, profileImage, firstName, lastName } = row.original;
				return (
					<div className='flex items-center gap-3'>
						<Avatar>
							<AvatarImage src={makePreviewURL(profileImage)} />
							<AvatarFallback>
								{firstName?.[0]}
								{lastName?.[0]}
							</AvatarFallback>
						</Avatar>
						<button
							className='font-semibold text-left hover:underline'
							onClick={() => setSelectedJobseeker(row.original)}
						>
							{fullName}
						</button>
					</div>
				);
			},
		},
		{
			header: 'Contact Info',
			cell: ({ row }) => {
				const { email, phone } = row.original;
				return (
					<div>
						<p>{email}</p>
						<p className='text-sm text-muted-foreground'>{phone}</p>
					</div>
				);
			},
		},
		{
			accessorKey: 'organizationNameEn',
			header: 'Organization',
			cell: ({ row }) => (
				<div>
					<p>{row.original.organizationNameEn}</p>
					<p className='text-sm text-muted-foreground'>{row.original.organizationNameBn}</p>
				</div>
			),
		},
	];

	const table = useReactTable({
		data: jobseekers,
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
		manualPagination: true,
		pageCount: meta?.totalPageCount,
	});

	const handlePageChange = (newPage: number) => {
		searchApplicants(newPage, {
			searchKey: debouncedTextSearch,
			skillIds: watchedSkillIds,
			outsourcingCategoryId: watchedCategoryId,
			postId: watchedPostId,
		});
	};

	const handleApply = () => {
		const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
		if (selectedRows.length > 0) {
			onApply(selectedRows, () => {
				table.resetRowSelection();
			});
		}
		setShowConfirmation(false);
	};

	return (
		<>
			<FormProvider {...filterForm}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
					}}
					className='space-y-4'
				>
					<Card className='p-4 border rounded-lg space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormAutocomplete
								control={filterForm.control}
								name='outsourcingCategoryId'
								label='Outsourcing Category'
								placeholder='Filter by category...'
								loadOptions={getOutsourcingCategoriesAsync}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.nameEn}
								allowClear
								onValueChange={() => filterForm.setValue('postId', '')}
							/>
							<FormAutocomplete
								control={filterForm.control}
								name='postId'
								label='Outsourcing Post'
								placeholder='Filter by post...'
								disabled={!watchedCategoryId}
								loadOptions={(search, callback) => {
									getPostOutsourcingAsync(search, (posts) => {
										const filtered = watchedCategoryId
											? posts.filter((p) => p.outsourcingCategoryId === watchedCategoryId)
											: posts;
										callback(filtered);
									});
								}}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.nameEn}
								initialLabel={filterForm.watch('postId')}
								allowClear
							/>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormMultiSelect
								control={filterForm.control}
								name='skillIds'
								label='Skills'
								placeholder='Filter by skills...'
								loadOptions={getSkillsAsync}
								getOptionValue={(option) => option.id}
								getOptionLabel={(option) => option.nameEn}
							/>
						</div>
					</Card>
				</form>
			</FormProvider>

			<Card className='my-4'>
				<CardHeader className='py-4'>
					<div className='flex justify-between items-center'>
						<div>
							<CardTitle>Search Results</CardTitle>
							<CardDescription>Select jobseekers to add them to the primary list below.</CardDescription>
						</div>
						{table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? (
							<Button onClick={() => setShowConfirmation(true)}>
								<UserPlus className='mr-2 h-4 w-4' />
								Add {table.getSelectedRowModel().rows.length} Selected Candidates
							</Button>
						) : null}
					</div>
				</CardHeader>
				<CardContent className='pt-1overflow-y-auto space-y-2'>
					<div className='relative w-full mb-4'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Filter results by name, email, or phone...'
							value={textSearch}
							onChange={(e) => setTextSearch(e.target.value)}
							className='pl-10 h-11'
						/>
					</div>
					<div className='rounded-md border'>
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
											No jobseekers found for the selected criteria.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
				<CardFooter>
					<Pagination meta={meta} onPageChange={handlePageChange} noun={'Jobseeker'} />
				</CardFooter>
			</Card>

			<Dialog open={!!selectedJobseeker} onOpenChange={(isOpen) => !isOpen && setSelectedJobseeker(null)}>
				<DialogContent className='max-w-5xl max-h-[90vh] overflow-y-auto'>
					{selectedJobseeker && <JobseekerProfileView jobseekerId={selectedJobseeker.userId} />}
				</DialogContent>
			</Dialog>
			<ConfirmationDialog
				open={showConfirmation}
				onOpenChange={setShowConfirmation}
				title='Confirm Add Applicants'
				description={`Are you sure you want to add ${
					table.getSelectedRowModel().rows.length
				} selected candidates to the applicant list?`}
				onConfirm={handleApply}
				confirmText='Yes, Add them'
				variant='warning'
			/>
		</>
	);
}
