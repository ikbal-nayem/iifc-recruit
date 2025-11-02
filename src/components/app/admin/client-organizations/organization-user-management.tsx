'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { useToast } from '@/hooks/use-toast';
import { IOrganizationUser } from '@/interfaces/master-data.interface';
import { getStatusVariant } from '@/lib/color-mapping';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const userSchema = z
	.object({
		name: z.string().min(1, 'Name is required.'),
		email: z.string().email('Please enter a valid email.'),
		role: z.enum(['Admin', 'Member']),
		password: z.string().min(8, 'Password must be at least 8 characters.'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
	isOpen: boolean;
	onClose: () => void;
	organizationId: string;
	onUserCreated: () => void;
}

function UserForm({ isOpen, onClose, organizationId, onUserCreated }: UserFormProps) {
	const form = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: { name: '', email: '', role: 'Member', password: '', confirmPassword: '' },
	});
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = (data: UserFormValues) => {
		setIsSubmitting(true);
		console.log({ ...data, organizationId });
		// Simulate API call
		setTimeout(() => {
			toast({
				title: 'User Created',
				description: `User ${data.name} has been created for this organization.`,
				variant: 'success',
			});
			setIsSubmitting(false);
			onUserCreated();
			onClose();
		}, 1000);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New User</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-2'>
						<FormInput control={form.control} name='name' label='Full Name' required />
						<FormInput control={form.control} name='email' label='Email Address' type='email' required />
						<FormSelect
							control={form.control}
							name='role'
							label='Role'
							required
							options={[
								{ value: 'Admin', label: 'Admin' },
								{ value: 'Member', label: 'Member' },
							]}
						/>
						<FormInput control={form.control} name='password' label='Password' type='password' required />
						<FormInput
							control={form.control}
							name='confirmPassword'
							label='Confirm Password'
							type='password'
							required
						/>
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

const mockUsers: IOrganizationUser[] = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john.d@example.com',
		role: 'Admin',
		status: 'Active',
		avatar: 'https://picsum.photos/seed/user1/100/100',
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane.s@example.com',
		role: 'Member',
		status: 'Active',
		avatar: 'https://picsum.photos/seed/user2/100/100',
	},
	{
		id: '3',
		name: 'Peter Jones',
		email: 'peter.j@example.com',
		role: 'Member',
		status: 'Inactive',
		avatar: 'https://picsum.photos/seed/user3/100/100',
	},
];

export function OrganizationUserManagement({ organizationId }: { organizationId: string }) {
	const [users, setUsers] = useState<IOrganizationUser[]>(mockUsers);
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
						{users.map((user) => (
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
						))}
					</div>
				</CardContent>
			</Card>
			<UserForm
				isOpen={isUserFormOpen}
				onClose={() => setIsUserFormOpen(false)}
				organizationId={organizationId}
				onUserCreated={handleUserCreated}
			/>
		</>
	);
}
