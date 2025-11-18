'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormMultiSelect } from '@/components/ui/form-multi-select';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/auth-context';
import { useDebounce } from '@/hooks/use-debounce';
import useLoader from '@/hooks/use-loader';
import { toast } from '@/hooks/use-toast';
import { UserType } from '@/interfaces/auth.interface';
import { IApiRequest, IMeta, IObject } from '@/interfaces/common.interface';
import { IClientOrganization, IOrganizationUser, IRole } from '@/interfaces/master-data.interface';
import { makePreviewURL } from '@/lib/file-oparations';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Edit, Loader2, PlusCircle, Search, Trash } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const userSchema = z.object({
	firstName: z.string().min(1, 'First name is required.'),
	lastName: z.string().min(1, 'Last name is required.'),
	email: z.string().email('Please enter a valid email.'),
	phone: z.string().optional(),
	roles: z.array(z.string()).min(1, 'At least one role is required.'),
	password: z.string().min(8, 'Password must be at least 8 characters.').optional(),
	organizationId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	allRoles: IRole[];
	initialData?: IOrganizationUser;
	isSuperAdmin: boolean;
	currentUserOrganization?: IClientOrganization;
}

function UserForm({
	isOpen,
	onClose,
	onSuccess,
	allRoles,
	initialData,
	isSuperAdmin,
	currentUserOrganization,
}: UserFormProps) {
	const form = useForm<UserFormValues>({
		resolver: zodResolver(
			initialData
				? userSchema.omit({ password: true }) // Password not needed for update
				: userSchema
		),
		defaultValues: {
			firstName: initialData?.firstName || '',
			lastName: initialData?.lastName || '',
			email: initialData?.email || '',
			phone: initialData?.phone || '',
			roles: initialData?.roles || [],
			organizationId: initialData?.organizationId,
		},
	});
	const [isSubmitting, setIsSubmitting] = useLoader(false);

	const filteredRoles = useMemo(() => {
		if (isSuperAdmin || currentUserOrganization?.systemOwner) {
			return allRoles.filter((role) => role.roleCode?.startsWith('IIFC_'));
		}
		return allRoles.filter(
			(role) =>
				(currentUserOrganization?.isClient && role.roleCode?.startsWith('CLIENT_')) ||
				(currentUserOrganization?.isExaminer && role.roleCode?.startsWith('EXAMINER_'))
		);
	}, [allRoles, currentUserOrganization, isSuperAdmin]);

	const handleSubmit = async (data: UserFormValues) => {
		setIsSubmitting(true);
		try {
			const payload: IObject = { ...data, id: initialData?.id, organizationId: currentUserOrganization?.id };
			const response = initialData
				? await UserService.updateUser(payload)
				: await UserService.createOwnUser(payload);

			toast.success({
				title: initialData ? 'User Updated' : 'User Created',
				description: `User ${data.firstName} ${data.lastName} has been ${
					initialData ? 'updated' : 'created'
				}.`,
			});
			onSuccess();
			onClose();
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to save user.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? 'Edit User' : 'Create New User'}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-2'>
						<div className='grid grid-cols-2 gap-4'>
							<FormInput control={form.control} name='firstName' label='First Name' required />
							<FormInput control={form.control} name='lastName' label='Last Name' required />
						</div>
						<FormInput control={form.control} name='email' label='Email Address' type='email' required />
						<FormInput control={form.control} name='phone' label='Phone Number' />
						<FormMultiSelect
							control={form.control}
							name='roles'
							label='Roles'
							required
							placeholder='Select role(s)'
							options={filteredRoles}
							getOptionValue={(option) => option.roleCode}
							getOptionLabel={(option) => option.nameEn}
						/>
						{!initialData && (
							<FormInput control={form.control} name='password' label='Password' type='password' required />
						)}
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Create User'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

const initMeta: IMeta = { page: 0, limit: 20 };

export function UserList({ allRoles }: { allRoles: IRole[] }) {
	const { currectUser } = useAuth();
	const [users, setUsers] = useState<IOrganizationUser[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [isUserFormOpen, setIsUserFormOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<IOrganizationUser | undefined>(undefined);
	const [userToDelete, setUserToDelete] = useState<IOrganizationUser | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	const debouncedSearch = useDebounce(searchQuery, 500);

	const isSuperAdmin = currectUser?.userType === UserType.SYSTEM;
	const organizationId = isSuperAdmin ? undefined : currectUser?.organizationId;

	const loadUsers = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						...(organizationId && { organizationId }),
						searchKey: search,
					},
					meta: { ...initMeta, page },
				};
				const response = await UserService.searchOrganizationUsers(payload);
				setUsers(response.body);
				setMeta(response.meta || initMeta);
			} catch (error: any) {
				toast.error({ description: error.message || 'Failed to load organization users.' });
			} finally {
				setIsLoading(false);
			}
		},
		[organizationId]
	);

	useEffect(() => {
		loadUsers(0, debouncedSearch);
	}, [loadUsers, debouncedSearch]);

	const handlePageChange = (newPage: number) => {
		loadUsers(newPage, debouncedSearch);
	};

	const handleOpenForm = (user?: IOrganizationUser) => {
		setEditingUser(user);
		setIsUserFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsUserFormOpen(false);
		setEditingUser(undefined);
	};

	const handleDelete = async () => {
		if (!userToDelete) return;
		try {
			await UserService.deleteUser(userToDelete.id);
			toast.success({ description: `User ${userToDelete.fullName} has been deleted.` });
			loadUsers(meta.page, debouncedSearch);
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to delete user.' });
		} finally {
			setUserToDelete(null);
		}
	};

	const columns: ColumnDef<IOrganizationUser>[] = useMemo(() => {
		const baseColumns: ColumnDef<IOrganizationUser>[] = [
			{
				accessorKey: 'fullName',
				header: 'User',
				cell: ({ row }) => {
					const user = row.original;
					return (
						<div className='flex items-center gap-4'>
							<Avatar>
								<AvatarImage src={makePreviewURL(user.profileImage)} />
								<AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<p className='font-semibold'>{user.fullName}</p>
								<p className='text-sm text-muted-foreground'>{user.email}</p>
							</div>
						</div>
					);
				},
			},
		];

		if (isSuperAdmin) {
			baseColumns.push({
				accessorKey: 'organizationNameEn',
				header: 'Organization',
				cell: ({ row }) => (
					<div className='flex flex-col'>
						<span>{row.original.organizationNameEn}</span>
						<small>{row.original.organizationNameBn}</small>
					</div>
				),
			});
		}

		baseColumns.push(
			{
				accessorKey: 'roles',
				header: 'Roles',
				cell: ({ row }) => {
					const user = row.original;
					return (
						<div className='flex flex-wrap gap-1'>
							{user.roles?.map((role) => (
								<Badge key={role} variant='secondary'>
									{allRoles.find((r) => r.roleCode === role)?.nameEn || role}
								</Badge>
							))}
						</div>
					);
				},
			},
			{
				id: 'actions',
				cell: ({ row }) => {
					const user = row.original;
					const isCurrentUser = user.id === currectUser?.id;

					return (
						<div className='flex gap-1 justify-end'>
							<Button variant='ghost' size='icon' onClick={() => handleOpenForm(user)}>
								<Edit className='h-4 w-4' />
							</Button>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => setUserToDelete(user)}
								disabled={isCurrentUser}
								title={isCurrentUser ? 'You cannot delete your own account' : 'Delete user'}
							>
								<Trash className='h-4 w-4 text-danger' />
							</Button>
						</div>
					);
				},
			}
		);

		return baseColumns;
	}, [isSuperAdmin, allRoles, currectUser?.id]);

	const table = useReactTable({
		data: users,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const renderMobileCard = (user: IOrganizationUser) => {
		const isCurrentUser = user.id === currectUser?.id;
		return (
			<Card key={user.id} className='p-4'>
				<div className='flex items-start justify-between'>
					<div className='flex items-center gap-4'>
						<Avatar>
							<AvatarImage src={makePreviewURL(user.profileImage)} />
							<AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<p className='font-semibold'>{user.fullName}</p>
							<p className='text-sm text-muted-foreground'>{user.email}</p>
							{isSuperAdmin && (
								<div className='text-xs text-muted-foreground mt-1'>
									<p>{user.organizationNameEn}</p>
									<p>{user.organizationNameBn}</p>
								</div>
							)}
						</div>
					</div>
					<div className='flex gap-1'>
						<Button variant='ghost' size='icon' onClick={() => handleOpenForm(user)}>
							<Edit className='h-4 w-4' />
						</Button>
						{!isCurrentUser && (
							<Button variant='ghost' size='icon' onClick={() => setUserToDelete(user)} title='Delete user'>
								<Trash className='h-4 w-4 text-danger' />
							</Button>
						)}
					</div>
				</div>
				<div className='flex flex-wrap gap-1 mt-2'>
					{user.roles?.map((role) => (
						<Badge key={role} variant='secondary'>
							{allRoles.find((r) => r.roleCode === role)?.nameEn || role}
						</Badge>
					))}
				</div>
			</Card>
		);
	};

	return (
		<>
			<Card className='glassmorphism'>
				<CardHeader className='flex-col md:flex-row items-center justify-between gap-4'>
					<div className='relative w-full md:max-w-sm'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search by name, email, or phone...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10 h-10'
						/>
					</div>
					<Button onClick={() => handleOpenForm()} className='w-full md:w-auto'>
						<PlusCircle className='mr-2 h-4 w-4' />
						Create User
					</Button>
				</CardHeader>
				<CardContent>
					{/* Mobile View */}
					<div className='md:hidden space-y-4'>
						{isLoading ? (
							[...Array(3)].map((_, i) => <Skeleton key={i} className='h-24 w-full' />)
						) : users.length > 0 ? (
							users.map(renderMobileCard)
						) : (
							<div className='text-center py-8 text-muted-foreground'>No users found.</div>
						)}
					</div>

					{/* Desktop View */}
					<div className='hidden md:block rounded-md border'>
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead key={header.id}>
												{flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{isLoading ? (
									[...Array(5)].map((_, i) => (
										<TableRow key={i}>
											<TableCell colSpan={columns.length}>
												<Skeleton className='h-12 w-full' />
											</TableCell>
										</TableRow>
									))
								) : users.length > 0 ? (
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
											No users found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{meta && meta.totalRecords && meta.totalRecords > 0 ? (
						<div className='mt-4'>
							<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun='user' />
						</div>
					) : null}
				</CardContent>
			</Card>
			{isUserFormOpen && (
				<UserForm
					isOpen={isUserFormOpen}
					onClose={handleCloseForm}
					onSuccess={() => loadUsers(meta.page, debouncedSearch)}
					allRoles={allRoles}
					initialData={editingUser}
					isSuperAdmin={isSuperAdmin}
					currentUserOrganization={currectUser?.organization}
				/>
			)}
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
		</>
	);
}
