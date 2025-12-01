'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import * as React from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ActionItem, ActionMenu } from '@/components/ui/action-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { IClientOrganization, IOutsourcingCategory } from '@/interfaces/master-data.interface';
import { makePreviewURL } from '@/lib/file-oparations';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { Building, FileText, Loader2, Search, Trash } from 'lucide-react';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';
import { JobseekerForm } from './jobseeker-form';
import { UserService } from '@/services/api/user.service';

const initMeta: IMeta = { page: 0, limit: 20, totalRecords: 0 };

export function JobseekerManagement({
	isFormOpen,
	setIsFormOpen,
	organizations,
}: {
	isFormOpen: boolean;
	setIsFormOpen: (isOpen: boolean) => void;
	organizations: IClientOrganization[];
}) {
	const [data, setData] = React.useState<JobseekerSearch[]>([]);
	const [meta, setMeta] = React.useState<IMeta>(initMeta);
	const [selectedJobseeker, setSelectedJobseeker] = React.useState<JobseekerSearch | null>(null);
	const { toast } = useToast();
	const [isLoading, setIsLoading] = React.useState(true);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [userToDelete, setUserToDelete] = React.useState<JobseekerSearch | null>(null);
	const debouncedSearch = useDebounce(searchQuery, 500);
	const [organizationFilter, setOrganizationFilter] = React.useState('all');

	const loadJobseekers = React.useCallback(
		async (page: number, search: string, orgId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						searchKey: search,
						...(orgId !== 'all' && { organizationId: orgId }),
					},
					meta: { page, limit: initMeta.limit },
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
		[toast]
	);

	React.useEffect(() => {
		loadJobseekers(0, debouncedSearch, organizationFilter);
	}, [debouncedSearch, loadJobseekers, organizationFilter]);

	const handlePageChange = (newPage: number) => {
		loadJobseekers(newPage, debouncedSearch, organizationFilter);
	};

	const handleDelete = async () => {
		if (!userToDelete) return;
		try {
			await UserService.deleteUser(userToDelete.userId);
			toast.success({ description: `Jobseeker ${userToDelete.fullName} has been deleted.` });
			loadJobseekers(meta.page, debouncedSearch, organizationFilter);
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to delete user.' });
		} finally {
			setUserToDelete(null);
		}
	};

	const getActionItems = (jobseeker: JobseekerSearch): ActionItem[] => [
		{
			label: 'View Full Profile',
			icon: <FileText className='mr-2 h-4 w-4' />,
			onClick: () => setSelectedJobseeker(jobseeker),
		},
		{ isSeparator: true },
		{
			label: 'Delete',
			icon: <Trash className='mr-2 h-4 w-4' />,
			onClick: () => setUserToDelete(jobseeker),
			variant: 'danger',
		},
	];

	const columns: ColumnDef<JobseekerSearch>[] = [
		{
			accessorKey: 'fullName',
			header: 'Applicant',
			cell: ({ row }) => {
				const { fullName, email, profileImage, firstName, lastName, phone } = row.original;
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
							<p className='text-sm text-muted-foreground'>{email}</p>
							<p className='text-sm text-muted-foreground'>{phone}</p>
						</div>
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
						{jobseeker.organizationNameEn && (
							<div className='text-xs text-muted-foreground mt-1 space-y-0.5'>
								<p className='flex items-center gap-1.5'>
									<Building className='h-3 w-3' /> {jobseeker.organizationNameEn}
								</p>
								<p className='flex items-center gap-1.5 pl-4 -ml-0.5'>{jobseeker.organizationNameBn}</p>
							</div>
						)}
					</div>
				</div>
				<ActionMenu items={getActionItems(jobseeker)} />
			</div>
		</Card>
	);

	return (
		<div className='space-y-4'>
			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Jobseeker List</CardTitle>
					<div className='flex flex-col md:flex-row gap-4 pt-4'>
						<div className='relative w-full md:max-w-sm'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search by name, email, or phone...'
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								className='pl-10 h-10'
							/>
						</div>
						<div className='w-full md:max-w-sm'>
							<FormAutocomplete
								name='organizationFilter'
								placeholder='Filter by organization...'
								options={[{ id: 'all', nameEn: 'All Organizations' }, ...organizations]}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.nameEn}
								value={organizationFilter}
								onValueChange={(value) => setOrganizationFilter(value || 'all')}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent className='relative'>
					{isLoading && data.length > 0 && (
						<div className='absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10'>
							<Loader2 className='h-8 w-8 animate-spin text-primary' />
						</div>
					)}
					{/* Mobile View */}
					<div className='md:hidden space-y-4'>
						{isLoading && data.length === 0 ? (
							[...Array(5)].map((_, i) => (
								<Card key={i} className='p-4'>
									<Skeleton className='h-24 w-full' />
								</Card>
							))
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
								{isLoading && data.length === 0 ? (
									[...Array(initMeta.limit)].map((_, i) => (
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
						<Pagination
							meta={meta}
							isLoading={isLoading}
							onPageChange={handlePageChange}
							noun={'jobseeker'}
						/>
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
			<JobseekerForm
				isOpen={isFormOpen}
				onClose={() => setIsFormOpen(false)}
				onSuccess={() => loadJobseekers(0, '', 'all')}
				organizations={organizations}
			/>
			{userToDelete && (
				<ConfirmationDialog
					open={!!userToDelete}
					onOpenChange={(open) => !open && setUserToDelete(null)}
					title='Are you sure?'
					description={`This will permanently delete the user "${userToDelete.fullName}".`}
					onConfirm={handleDelete}
					confirmText='Delete'
				/>
			)}
		</div>
	);
}
