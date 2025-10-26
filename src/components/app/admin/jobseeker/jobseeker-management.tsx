
'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { FormMultiSelect } from '@/components/ui/form-multi-select';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { makePreviewURL } from '@/lib/file-oparations';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { getSkillsAsync } from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Filter, Loader2, Search, Send, UserX } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

const filterSchema = z.object({
	skillIds: z.array(z.string()).optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

export function JobseekerManagement() {
	const [data, setData] = React.useState<JobseekerSearch[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [selectedJobseeker, setSelectedJobseeker] = React.useState<JobseekerSearch | null>(null);
	const { toast } = useToast();
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const [selectedSkills, setSelectedSkills] = React.useState<ICommonMasterData[]>([]);

	const filterForm = useForm<FilterFormValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			skillIds: [],
		},
	});

	const loadJobseekers = React.useCallback(
		async (page: number, search: string, skillIds?: string[]) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { searchKey: search, ...(skillIds && skillIds.length > 0 && { skillIds }) },
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

	const onFilterSubmit = (values: FilterFormValues) => {
		loadJobseekers(0, debouncedSearch, values.skillIds);
	};

	React.useEffect(() => {
		const skillIds = filterForm.getValues('skillIds');
		loadJobseekers(0, debouncedSearch, skillIds);
	}, [debouncedSearch, loadJobseekers, filterForm]);

	const handlePageChange = (newPage: number) => {
		const skillIds = filterForm.getValues('skillIds');
		loadJobseekers(newPage, debouncedSearch, skillIds);
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
			header: 'Applicant',
			cell: ({ row }) => {
				const { fullName, email, profileImage, firstName, lastName } = row.original;
				return (
					<div className='flex items-center gap-3'>
						<Avatar>
							<AvatarImage src={makePreviewURL(profileImage)} alt={fullName} />
							<AvatarFallback>
								{firstName?.charAt(0)}
								{lastName?.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div>
							<p className='font-semibold'>{fullName}</p>
							<p className='text-xs text-muted-foreground'>{email}</p>
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
			cell: ({ row }) => <ActionMenu items={getActionItems(row.original)} />,
		},
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
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
			<Card className='glassmorphism p-4'>
				<FormProvider {...filterForm}>
					<form onSubmit={filterForm.handleSubmit(onFilterSubmit)} className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div className='w-full'>
								<FormMultiSelect
									control={filterForm.control}
									name='skillIds'
									label='Filter by skills'
									placeholder='Select skills...'
									loadOptions={getSkillsAsync}
									selected={selectedSkills}
									onAdd={(skill) => {
										const newSkills = [...selectedSkills, skill];
										setSelectedSkills(newSkills);
										filterForm.setValue(
											'skillIds',
											newSkills.map((s) => s.id)
										);
									}}
									onRemove={(skill) => {
										const newSkills = selectedSkills.filter((s) => s.id !== skill.id);
										setSelectedSkills(newSkills);
										filterForm.setValue(
											'skillIds',
											newSkills.map((s) => s.id)
										);
									}}
								/>
							</div>
							<div className='flex items-end'>
								<Button type='submit' className='w-full md:w-auto h-11'>
									<Filter className='mr-2 h-4 w-4' /> Filter
								</Button>
							</div>
						</div>
					</form>
				</FormProvider>
			</Card>

			<Card className='glassmorphism'>
				<CardHeader>
					<div className='relative w-full md:max-w-sm'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search by name, email, or phone...'
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							className='pl-10 h-11'
						/>
					</div>
				</CardHeader>
				<CardContent>
					{/* Mobile View */}
					<div className='md:hidden space-y-4'>
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
					<div className='hidden md:block rounded-md border'>
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
												<Skeleton className='h-12 w-full' />
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
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
				{meta && meta.totalRecords && meta.totalRecords > 0 ? (
					<CardFooter>
						<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={'jobseeker'} />
					</CardFooter>
				) : null}
			</Card>

			<Dialog open={!!selectedJobseeker} onOpenChange={(isOpen) => !isOpen && setSelectedJobseeker(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Jobseeker Profile</DialogTitle>
						<DialogDescription>This is a preview of the jobseeker&apos;s full profile.</DialogDescription>
					</DialogHeader>
					{selectedJobseeker && <JobseekerProfileView jobseekerId={selectedJobseeker.userId} />}
				</DialogContent>
			</Dialog>
		</div>
	);
}
