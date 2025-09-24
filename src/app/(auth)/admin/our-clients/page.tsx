
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Loader2, Mail, Phone, PlusCircle, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	organizationId: z.string().min(1, 'Please select an organization.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function OurClientsPage() {
	const { toast } = useToast();
	const [clients, setClients] = useState<IOrganization[]>([]);
	const [allOrganizations, setAllOrganizations] = useState<IOrganization[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { organizationId: '' },
	});

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const [clientsRes, orgsRes] = await Promise.all([
				MasterDataService.client.getList(),
				MasterDataService.organization.getList({ meta: { limit: 1000 } }), // Fetch all orgs for the dropdown
			]);
			setClients(clientsRes.body);
			setAllOrganizations(orgsRes.body);
		} catch (error) {
			console.error('Failed to load data', error);
			toast({
				title: 'Error',
				description: 'Failed to load clients and organizations.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleAddClient = async (data: FormValues) => {
		setIsSubmitting(true);
		try {
			await MasterDataService.client.add({ organizationId: data.organizationId });
			toast({ title: 'Success', description: 'Client added successfully.', variant: 'success' });
			loadData();
			setIsFormOpen(false);
			form.reset();
		} catch (error) {
			toast({ title: 'Error', description: 'Failed to add client.', variant: 'danger' });
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleRemoveClient = async (organizationId: string) => {
		try {
			await MasterDataService.client.delete(organizationId);
			toast({ title: 'Success', description: 'Client removed successfully.', variant: 'success' });
			loadData();
		} catch (error) {
			toast({ title: 'Error', description: 'Failed to remove client.', variant: 'danger' });
		}
	};

	const availableOrganizations = allOrganizations.filter(
		(org) => !clients.some((client) => client.id === org.id)
	);

	return (
		<div className='space-y-8'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-headline font-bold'>Our Clients</h1>
					<p className='text-muted-foreground'>Manage the organizations you work with.</p>
				</div>
				<Button className='w-full sm:w-auto' onClick={() => setIsFormOpen(true)}>
					<PlusCircle className='mr-2 h-4 w-4' />
					Add New Client
				</Button>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{isLoading
					? [...Array(3)].map((_, i) => (
							<Card key={i} className='glassmorphism'>
								<CardHeader>
									<Skeleton className='h-6 w-3/4' />
									<Skeleton className='h-4 w-1/2' />
								</CardHeader>
								<CardContent className='space-y-2'>
									<Skeleton className='h-4 w-full' />
									<Skeleton className='h-4 w-2/3' />
								</CardContent>
							</Card>
					  ))
					: clients.map((client) => (
							<Card key={client.id} className='glassmorphism flex flex-col'>
								<CardHeader>
									<CardTitle>{client.name}</CardTitle>
									<CardDescription>{client.industryType?.name || 'N/A'}</CardDescription>
								</CardHeader>
								<CardContent className='flex-grow space-y-2 text-sm text-muted-foreground'>
									{client.email && (
										<div className='flex items-center gap-2'>
											<Mail className='h-4 w-4' />
											<span>{client.email}</span>
										</div>
									)}
									{client.phone && (
										<div className='flex items-center gap-2'>
											<Phone className='h-4 w-4' />
											<span>{client.phone}</span>
										</div>
									)}
									{client.website && (
										<div className='flex items-center gap-2'>
											<Globe className='h-4 w-4' />
											<a href={client.website} target='_blank' rel='noopener noreferrer' className='hover:underline'>
												Visit Website
											</a>
										</div>
									)}
								</CardContent>
								<div className='p-4 pt-0'>
									<ConfirmationDialog
										trigger={
											<Button variant='outline' className='w-full'>
												<Trash className='mr-2 h-4 w-4' /> Remove
											</Button>
										}
										title='Are you sure?'
										description={`This will remove "${client.name}" from your client list. It will not delete the organization itself.`}
										onConfirm={() => handleRemoveClient(client.id!)}
										confirmText='Confirm Remove'
										variant='danger'
									/>
								</div>
							</Card>
					  ))}
			</div>

			{!isLoading && clients.length === 0 && (
				<div className='text-center py-16 text-muted-foreground'>
					<p>You haven&apos;t added any clients yet.</p>
				</div>
			)}

			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Client</DialogTitle>
						<DialogDescription>Select an organization to add them to your client list.</DialogDescription>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleAddClient)} className='space-y-4 py-4'>
							<FormAutocomplete
								control={form.control}
								name='organizationId'
								label='Organization'
								placeholder='Search for an organization...'
								required
								options={availableOrganizations.map((org) => ({ value: org.id!, label: org.name }))}
								disabled={isSubmitting}
							/>
							<DialogFooter className='pt-4'>
								<Button type='button' variant='ghost' onClick={() => setIsFormOpen(false)} disabled={isSubmitting}>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
									Add Client
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
