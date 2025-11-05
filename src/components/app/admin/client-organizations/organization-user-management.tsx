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
import { useToast } from '@/hooks/use-toast';
import { IOrganizationUser, IRole } from '@/interfaces/master-data.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userSchema = z.object({
	firstName: z.string().min(1, 'First name is required.'),
	lastName: z.string().min(1, 'Last name is required.'),
	email: z.string().email('Please enter a valid email.'),
	phone: z.string().max(11, 'Invalid phone number').regex(/^\d+$/, 'Invalid phone number').optional(),
	roles: z.array(z.string()).min(1, 'Role is required'),
	password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
	isOpen: boolean;
	onClose: () => void;
	organizationId: string;
	onUserCreated: () => void;
	roles: IRole[];
}

function UserForm({ isOpen, onClose, organizationId, onUserCreated, roles }: UserFormProps) {
	const form = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			roles: [],
			password: '',
		},
	});
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: UserFormValues) => {
		setIsSubmitting(true);
		try {
			await UserService.createUser({ ...data, organizationId });
			toast({
				title: 'User Created',
				description: `User ${data.firstName} ${data.lastName} has been created.`,
				variant: 'success',
			});
			onUserCreated();
			onClose();
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Failed to create user.',
				variant: 'danger',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New User</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-2'>
						<div className='grid grid-cols-2 gap-4'>
							<FormInput control={form.control} name='firstName' label='First Name' required />
							<FormInput control={form.control} name='lastName' label='Last Name' required />
						</div>
						<FormInput control={form.control} name='email' label='Email Address' type='email' required />
						<FormInput control={form.control} name='phone' label='Phone Number' placeholder='01xxxxxxxxx' />
						<FormMultiSelect
							control={form.control}
							name='roles'
							label='Role'
							required
							options={roles}
							// getOptionLabel={(option) => option.nameEn}
							// getOptionValue={(option) => option.id!}
						/>
						<FormInput control={form.control} name='password' label='Password' type='password' required />
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Create User
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
	const [users, setUsers] = useState<IOrganizationUser[]>([]);
	const [isUserFormOpen, setIsUserFormOpen] = useState(false);

	const handleUserCreated = () => {
		// In a real app, you would refetch the user list here
		console.log('Refetching users for organization', organizationId);
	};

	return (
		<>
			<Card className='glassmorphism'>
				<CardHeader className='flex-row items-center justify-between'>
					<CardTitle>Organization Users</CardTitle>
					<Button onClick={() => setIsUserFormOpen(true)}>
						<PlusCircle className='mr-2 h-4 w-4' />
						Create User
					</Button>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{users.length > 0 ? (
							users.map((user) => (
								<Card key={user.id} className='p-4 flex items-center justify-between'>
									<div className='flex items-center gap-4'>
										<Avatar>
											<AvatarImage src={user.avatar} />
											<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-semibold'>{user.name}</p>
											<p className='text-sm text-muted-foreground'>{user.email}</p>
										</div>
									</div>
									<div className='flex items-center gap-4'>
										<Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
										<Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
										<div className='flex gap-1'>
											<Button variant='ghost' size='icon'>
												<Edit className='h-4 w-4' />
											</Button>
											<ConfirmationDialog
												trigger={
													<Button variant='ghost' size='icon'>
														<Trash className='h-4 w-4 text-danger' />
													</Button>
												}
												description={`Are you sure you want to delete user ${user.name}?`}
												onConfirm={() => alert('Deleting user... (not implemented)')}
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
			<UserForm
				isOpen={isUserFormOpen}
				onClose={() => setIsUserFormOpen(false)}
				organizationId={organizationId}
				onUserCreated={handleUserCreated}
				roles={roles}
			/>
		</>
	);
}
