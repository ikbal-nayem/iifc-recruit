
'use client';

import { FormMasterData } from '@/app/(auth)/admin/client-organizations/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { isBangla, isEnglish } from '@/lib/utils';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Globe, Loader2, Mail, Phone, PlusCircle, Search, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	nameEn: z.string().min(1, 'English name is required.').refine(isEnglish, {
		message: 'Only English characters, numbers, and some special characters are allowed.',
	}),
	nameBn: z.string().min(1, 'Bengali name is required.').refine(isBangla, {
		message: 'Only Bengali characters, numbers, and some special characters are allowed.',
	}),
	organizationTypeId: z.coerce.number().min(1, 'Organization Type is required.'),
	address: z.string().optional(),
	contactPersonName: z.string().optional(),
	contactNumber: z.string().optional(),
	email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
	website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;

interface ClientOrganizationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: FormValues) => Promise<boolean>;
	initialData?: IClientOrganization;
	noun: string;
	masterData: FormMasterData;
}

function ClientOrganizationForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	noun,
	masterData: { organizationTypes },
}: ClientOrganizationFormProps) {
	const defaultValues = initialData
		? { ...initialData }
		: {
				nameEn: '',
				nameBn: '',
				organizationTypeId: undefined,
				address: '',
				contactPersonName: '',
				contactNumber: '',
				email: '',
				website: '',
		  };

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFormSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const success = await onSubmit(data);
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add ${noun}`}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4 py-4' noValidate>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='nameEn'
								label='Name (English)'
								placeholder='Client Name'
								required
								disabled={isSubmitting}
							/>
							<FormInput
								control={form.control}
								name='nameBn'
								label='Name (Bangla)'
								placeholder='ক্লায়েন্টের নাম'
								required
								disabled={isSubmitting}
							/>
						</div>
						<FormAutocomplete
							control={form.control}
							name='organizationTypeId'
							label='Organization Type'
							required
							placeholder='Select Organization Type'
							options={organizationTypes}
							getOptionValue={(option) => option.id!}
							getOptionLabel={(option) => option.name}
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='address'
							label='Address'
							placeholder='Address'
							disabled={isSubmitting}
						/>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='contactPersonName'
								label='Contact Person'
								placeholder='Name'
								disabled={isSubmitting}
							/>
							<FormInput
								control={form.control}
								name='contactNumber'
								label='Contact Number'
								placeholder='Phone number'
								disabled={isSubmitting}
								startIcon={<Phone className='h-4 w-4 text-muted-foreground' />}
							/>
						</div>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='email'
								label='Email'
								type='email'
								placeholder='Contact email'
								disabled={isSubmitting}
								startIcon={<Mail className='h-4 w-4 text-muted-foreground' />}
							/>
							<FormInput
								control={form.control}
								name='website'
								label='Website'
								type='url'
								placeholder='https://example.com'
								disabled={isSubmitting}
								startIcon={<Globe className='h-4 w-4 text-muted-foreground' />}
							/>
						</div>

						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add'}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

const initMeta: IMeta = { page: 0, limit: 10 };

interface ClientOrganizationCrudProps {
	title: string;
	description: string;
	noun: string;
	masterData: FormMasterData;
}

export function ClientOrganizationCrud({ title, description, noun, masterData }: ClientOrganizationCrudProps) {
	const { toast } = useToast();
	const [items, setItems] = useState<IClientOrganization[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);

	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<IClientOrganization | undefined>(undefined);

	const loadItems = useCallback(async (page: number, search: string) => {
		setIsLoading(true);
		try {
			const payload: IApiRequest = {
				body: { nameEn: search },
				meta: { page: page, limit: meta.limit },
			};
			const response = await MasterDataService.clientOrganization.getList(payload);
			setItems(response.body);
			setMeta(response.meta);
		} catch (error) {
			console.error('Failed to load items', error);
			toast({
				title: 'Error',
				description: 'Failed to load client organizations.',
				variant: 'danger',
			});
		} finally {
			setIsLoading(false);
			setIsInitialLoading(false);
		}
	}, [meta.limit, toast]);

	useEffect(() => {
		loadItems(0, '');
	}, []);

	useEffect(() => {
		if (!isInitialLoading) {
			loadItems(0, debouncedSearch);
		}
	}, [debouncedSearch, isInitialLoading, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const handleOpenForm = (item?: IClientOrganization) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: FormValues): Promise<boolean> => {
		const payload = { ...editingItem, ...data };
		try {
			const response = editingItem?.id
				? await MasterDataService.clientOrganization.update(payload)
				: await MasterDataService.clientOrganization.add({ ...payload, isActive: true });

			toast({ description: response.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error: any) {
			console.error('Failed to save item', error);
			toast({ title: 'Error', description: error.message || `Failed to save ${noun}.`, variant: 'danger' });
			return false;
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await MasterDataService.clientOrganization.delete(id.toString());
			toast({ title: 'Success', description: 'Client organization deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch);
		} catch (error: any) {
			console.error('Failed to delete item', error);
			toast({
				title: 'Error',
				description: error?.message || 'Failed to delete client organization.',
				variant: 'danger',
			});
		}
	};

	const handleToggleActive = async (item: IClientOrganization) => {
		if (!item.id) return;
		setIsSubmitting(item.id);
		const updatedItem = { ...item, isActive: !item.isActive };
		try {
			await MasterDataService.clientOrganization.update(updatedItem);
			setItems((prevItems) => prevItems.map((i) => (i.id === item.id ? updatedItem : i)));
			toast({
				title: 'Success',
				description: 'Status updated successfully.',
				variant: 'success',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update status.',
				variant: 'danger',
			});
		} finally {
			setIsSubmitting(null);
		}
	};

	const renderViewItem = (item: IClientOrganization) => (
		<Card
			key={item.id}
			className='p-4 flex flex-col sm:flex-row justify-between items-start bg-background/50 gap-4'
		>
			<div className='flex-1 space-y-1'>
				<p className={`font-semibold ${!item.isActive && 'text-muted-foreground line-through'}`}>{item.nameEn}</p>
				<p className='text-sm text-muted-foreground'>{item.nameBn}</p>
				<p className='text-xs text-muted-foreground'>Type: {item.organizationType?.name || 'N/A'}</p>
				<div className='flex flex-wrap items-center gap-x-4 gap-y-1 pt-1'>
					{item.contactPersonName && (
						<span className='text-xs text-muted-foreground'>Contact: {item.contactPersonName}</span>
					)}
					{item.contactNumber && (
						<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
							<Phone className='h-3 w-3' /> {item.contactNumber}
						</span>
					)}
					{item.email && (
						<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
							<Mail className='h-3 w-3' /> {item.email}
						</span>
					)}
				</div>
			</div>
			<div className='flex items-center gap-2 self-start'>
				<Switch
					checked={item.isActive}
					onCheckedChange={() => handleToggleActive(item)}
					disabled={isSubmitting === item.id}
				/>
				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8'
					onClick={() => handleOpenForm(item)}
					disabled={isSubmitting === item.id}
				>
					<Edit className='h-4 w-4' />
				</Button>
				<ConfirmationDialog
					trigger={
						<Button variant='ghost' size='icon' className='h-8 w-8' disabled={isSubmitting === item.id}>
							<Trash className='h-4 w-4 text-danger' />
						</Button>
					}
					description={`This will permanently delete the ${noun.toLowerCase()} "${item.nameEn}".`}
					onConfirm={() => handleDelete(item.id!)}
					confirmText='Delete'
				/>
			</div>
		</Card>
	);

	return (
		<div className='space-y-8'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-headline font-bold'>{title}</h1>
					<p className='text-muted-foreground'>{description}</p>
				</div>
				<Button className='w-full sm:w-auto' onClick={() => handleOpenForm()}>
					<PlusCircle className='mr-2 h-4 w-4' />
					Add {noun}
				</Button>
			</div>
			<Card className='glassmorphism'>
				<CardContent className='pt-6'>
					<div className='relative w-full lg:max-w-xs'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder={`Search ${noun.toLowerCase()}s...`}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
					<div className='space-y-2 pt-4'>
						{isInitialLoading
							? [...Array(5)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
							: items.map(renderViewItem)}
						{!isInitialLoading && items.length === 0 && (
							<p className='text-center text-sm text-muted-foreground py-4'>
								No {noun.toLowerCase()}s found.
							</p>
						)}
					</div>
				</CardContent>
				{meta && meta.totalRecords && meta.totalRecords > 0 && !isInitialLoading ? (
					<CardFooter>
						<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={noun} />
					</CardFooter>
				) : null}
			</Card>
			{isFormOpen && (
				<ClientOrganizationForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun={noun}
					masterData={masterData}
				/>
			)}
		</div>
	);
}
