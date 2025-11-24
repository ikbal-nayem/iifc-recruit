'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormMultiSelect } from '@/components/ui/form-multi-select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, useToast } from '@/hooks/use-toast';
import { IApiRequest } from '@/interfaces/common.interface';
import { IOrganizationUser, IRole } from '@/interfaces/master-data.interface';
import { makePreviewURL } from '@/lib/file-oparations';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const userSchema = z.object({
	firstName: z.string().min(1, 'First name is required.'),
	lastName: z.string().min(1, 'Last name is required.'),
	email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
	phone: z
		.string()
		.min(1, 'Phone number is required')
		.max(11, 'Phone number must be 11 digits.')
		.regex(/^01[0-9]{9}$/, 'Invalid phone number'),
	roles: z.array(z.string()).min(1, 'At least one role is required.'),
	password: z.string().min(8, 'Password must be at least 8 characters.').optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
	isOpen: boolean;
	onClose: () => void;
	organizationId: string;
	onSuccess: () => void;
	roles: IRole[];
	initialData?: IOrganizationUser;
}

function UserForm({ isOpen, onClose, organizationId, onSuccess, roles, initialData }: UserFormProps) {
	const form = useForm<UserFormValues>({
		resolver: zodResolver(
			initialData
				? userSchema.omit({ password: true }) // Password not needed for update
				: userSchema
		),
		defaultValues: {
			firstName: initialData?.fullName.split(' ')[0] || '',
			lastName: initialData?.fullName.split(' ').slice(1).join(' ') || '',
			email: initialData?.email || '',
			phone: initialData?.phone || '',
			roles: initialData?.roles || [],
		},
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: UserFormValues) => {
		setIsSubmitting(true);
		try {
			const payload = { ...data, organizationId, id: initialData?.id };
			const response = initialData
				? await UserService.updateUser(payload)
				: await UserService.createUser(payload);

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
						<FormInput control={form.control} name='email' label='Email Address' type='email' />
						<FormInput
							control={form.control}
							name='phone'
							label='Phone Number'
							placeholder='01xxxxxxxxx'
							required
						/>
						<FormMultiSelect
							control={form.control}
							name='roles'
							label='Roles'
							required
							placeholder='Select role(s)'
							options={roles}
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

export function OrganizationUserManagement({
	organizationId,
	roles,
}: {
	organizationId: string;
	roles: IRole[];
}) {
	const { toast } = useToast();
	const [users, setUsers] = useState<IOrganizationUser[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isUserFormOpen, setIsUserFormOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<IOrganizationUser | undefined>(undefined);
	const [userToDelete, setUserToDelete] = useState<IOrganizationUser | null>(null);

	const loadUsers = useCallback(async () => {
		setIsLoading(true);
		try {
			const payload: IApiRequest = {
				body: { organizationId },
				meta: { page: 0, limit: 100 },
			};
			const response = await UserService.searchOrganizationUsers(payload);
			setUsers(response.body);
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to load organization users.' });
		} finally {
			setIsLoading(false);
		}
	}, [organizationId, toast]);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

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
			loadUsers();
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to delete user.' });
		} finally {
			setUserToDelete(null);
		}
	};

	return (
		<>
			<Card className='glassmorphism'>
				<CardHeader className='flex-row items-center justify-between'>
					<CardTitle>Organization Users</CardTitle>
					<Button onClick={() => handleOpenForm()}>
						<PlusCircle className='mr-2 h-4 w-4' />
						Create User
					</Button>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{isLoading ? (
							[...Array(2)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
						) : users.length > 0 ? (
							users.map((user) => (
								<Card key={user.id} className='p-4 flex items-center justify-between'>
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
									<div className='flex items-center gap-4'>
										<div className='hidden sm:flex flex-wrap gap-1 justify-end'>
											{user.roles?.map((role) => (
												<Badge key={role} variant='secondary'>
													{roles.find((r) => r.roleCode === role)?.nameEn || role}
												</Badge>
											))}
										</div>
										<div className='flex gap-1'>
											<Button variant='ghost' size='icon' onClick={() => handleOpenForm(user)}>
												<Edit className='h-4 w-4' />
											</Button>
											<ConfirmationDialog
												trigger={
													<Button variant='ghost' size='icon'>
														<Trash className='h-4 w-4 text-danger' />
													</Button>
												}
												title='Are you sure?'
												description={`This will permanently delete the user ${user.fullName}.`}
												onConfirm={handleDelete}
												open={userToDelete?.id === user.id}
												onOpenChange={(open) => !open && setUserToDelete(null)}
											/>
										</div>
									</div>
								</Card>
							))
						) : (
							<div className='text-center py-8 text-muted-foreground'>
								No users found for this organization.
							</div>
						)}
					</div>
				</CardContent>
			</Card>
			{isUserFormOpen && (
				<UserForm
					isOpen={isUserFormOpen}
					onClose={handleCloseForm}
					organizationId={organizationId}
					onSuccess={loadUsers}
					roles={roles}
					initialData={editingUser}
				/>
			)}
		</>
	);
}
