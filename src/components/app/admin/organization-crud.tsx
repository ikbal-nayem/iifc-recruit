
'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Globe, Loader2, Mail, Phone, PlusCircle, Search, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	countryCode: z.string().min(1, 'Country is required.'),
	organizationTypeId: z.string().min(1, 'Organization Type is required.'),
	industryTypeId: z.string().optional(),
	address: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
	website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;

interface OrganizationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: Omit<IOrganization, 'id'> | IOrganization) => Promise<boolean>;
	initialData?: IOrganization;
	countries: ICommonMasterData[];
	industryTypes: ICommonMasterData[];
	organizationTypes: ICommonMasterData[];
	noun: string;
}

function OrganizationForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	countries,
	industryTypes,
	organizationTypes,
	noun,
}: OrganizationFormProps) {
	const defaultValues = initialData
		? { ...initialData }
		: {
				name: '',
				countryCode: countries.find((c) => c.name === 'Bangladesh')?.code || '',
				organizationTypeId: '',
				industryTypeId: '',
				address: '',
				phone: '',
				email: '',
				website: '',
		  };

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const payload: Omit<IOrganization, 'id'> | IOrganization = {
			...initialData,
			...data,
			isActive: initialData?.isActive ?? true,
		};
		const success = await onSubmit(payload);
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
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4' noValidate>
						<FormInput
							control={form.control}
							name='name'
							label='Name'
							placeholder='Organization Name'
							required
							disabled={isSubmitting}
						/>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormAutocomplete
								control={form.control}
								name='countryCode'
								label='Country'
								placeholder='Select Country'
								required
								options={countries.map((c) => ({ value: c.code!, label: c.name }))}
								disabled={isSubmitting}
							/>
							<FormAutocomplete
								control={form.control}
								name='organizationTypeId'
								label='Organization Type'
								required
								placeholder='Select Organization Type'
								options={organizationTypes.map((o) => ({ value: o.id!, label: o.name }))}
								disabled={isSubmitting}
							/>
						</div>
						<FormAutocomplete
							control={form.control}
							name='industryTypeId'
							label='Industry Type'
							placeholder='Select Industry Type'
							options={industryTypes.map((i) => ({ value: i.id!, label: i.name }))}
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
								name='phone'
								label='Phone'
								placeholder='Contact number'
								disabled={isSubmitting}
								startIcon={<Phone className='h-4 w-4 text-muted-foreground' />}
							/>
							<FormInput
								control={form.control}
								name='email'
								label='Email'
								type='email'
								placeholder='Contact email'
								disabled={isSubmitting}
								startIcon={<Mail className='h-4 w-4 text-muted-foreground' />}
							/>
						</div>
						<FormInput
							control={form.control}
							name='website'
							label='Website'
							type='url'
							placeholder='https://example.com'
							disabled={isSubmitting}
							startIcon={<Globe className='h-4 w-4 text-muted-foreground' />}
						/>

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

interface OrganizationCrudProps {
	title: string;
	description: string;
	noun: string;
	countries: ICommonMasterData[];
	industryTypes: ICommonMasterData[];
	organizationTypes: ICommonMasterData[];
}

export function OrganizationCrud({
	title,
	description,
	noun,
	countries,
	industryTypes,
	organizationTypes,
}: OrganizationCrudProps) {
	const { toast } = useToast();
	const [items, setItems] = useState<IOrganization[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);

	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const [countryFilter, setCountryFilter] = useState('all');
	const [industryFilter, setIndustryFilter] = useState('all');
	const [organizationTypeFilter, setOrganizationTypeFilter] = useState('all');

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<IOrganization | undefined>(undefined);

	const loadItems = useCallback(
		async (
			page: number,
			search: string,
			countryCode: string,
			industryId: string,
			orgTypeId: string,
			isInitial = false
		) => {
			if (isInitial) {
				setIsInitialLoading(true);
			} else {
				setIsLoading(true);
			}

			const payload: IApiRequest = {
				body: {
					name: search,
					...(countryCode !== 'all' && { countryCode }),
					...(industryId !== 'all' && { industryTypeId: industryId }),
					...(orgTypeId !== 'all' && { organizationTypeId: orgTypeId }),
				},
				meta: { page: page, limit: meta.limit },
			};
			MasterDataService.organization
				.getList(payload)
				.then((res) => {
					setItems(res.body);
					setMeta(res.meta);
				})
				.catch((error) => {
					console.error('Failed to load items', error);
					toast({
						description: error?.message || 'Failed to load organizations.',
						variant: 'destructive',
					});
				})
				.finally(() => {
					if (isInitial) {
						setIsInitialLoading(false);
					} else {
						setIsLoading(false);
					}
				});
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		loadItems(0, '', 'all', 'all', 'all', true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isInitialLoading) {
			loadItems(0, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, countryFilter, industryFilter, organizationTypeFilter]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
	};

	const handleAdd = async (item: Omit<IOrganization, 'id'>): Promise<boolean> => {
		try {
			const resp = await MasterDataService.organization.add(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to add item', error);
			toast({
				title: 'Error',
				description: error?.message || 'Failed to add organization.',
				variant: 'destructive',
			});
			return false;
		}
	};

	const handleUpdate = async (item: IOrganization): Promise<boolean> => {
		try {
			const resp = await MasterDataService.organization.update(item);
			toast({ description: resp.message, variant: 'success' });
			return true;
		} catch (error: any) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: error.message || 'Failed to update organization.', variant: 'destructive' });
			return false;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.organization.delete(id);
			toast({ title: 'Success', description: 'Organization deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to delete item', error);
			toast({
				title: 'Error',
				description: error?.message || 'Failed to delete organization.',
				variant: 'destructive',
			});
			return false;
		}
	};

	const handleOpenForm = (item?: IOrganization) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: Omit<IOrganization, 'id'> | IOrganization) => {
		const success = editingItem
			? await handleUpdate({ ...data, id: editingItem.id, isActive: editingItem.isActive })
			: await handleAdd(data);
		if (success) {
			handleCloseForm();
			loadItems(meta.page, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
		}
		return success;
	};

	const handleToggleActive = async (item: IOrganization) => {
		if (!item.id) return;
		setIsSubmitting(item.id);
		const updatedItem = { ...item, isActive: !item.isActive };
		const success = await handleUpdate(updatedItem);
		if (success) {
			setItems((prevItems) => prevItems.map((i) => (i.id === item.id ? updatedItem : i)));
			toast({
				title: 'Success',
				description: 'Status updated successfully.',
				variant: 'success',
			});
		}
		setIsSubmitting(null);
	};

	const renderViewItem = (item: IOrganization) => (
		<Card
			key={item.id}
			className='p-4 flex flex-col sm:flex-row justify-between items-start bg-background/50 gap-4'
		>
			<div className='flex-1 space-y-1'>
				<p className={`font-semibold ${!item.isActive && 'text-muted-foreground line-through'}`}>
					{item.name}
				</p>
				<div className='text-xs text-muted-foreground space-y-1'>
					<p>
						{countries?.find((c) => c.code === item.countryCode)?.name} | Industry:{' '}
						{industryTypes?.find((i) => i.id === item.industryTypeId)?.name || 'N/A'} | Type:{' '}
						{organizationTypes?.find((o) => o.id === item.organizationTypeId)?.name || 'N/A'}
					</p>
					{item.address && <p className='text-xs text-muted-foreground'>{item.address}</p>}
					<div className='flex flex-wrap items-center gap-x-4 gap-y-1 pt-1'>
						{item.phone && (
							<span className='flex items-center gap-1.5'>
								<Phone className='h-3 w-3' /> {item.phone}
							</span>
						)}
						{item.email && (
							<span className='flex items-center gap-1.5'>
								<Mail className='h-3 w-3' /> {item.email}
							</span>
						)}
						{item.website && (
							<a
								href={item.website}
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center gap-1.5 hover:underline'
							>
								<Globe className='h-3 w-3' /> Website
							</a>
						)}
					</div>
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
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant='ghost' size='icon' className='h-8 w-8' disabled={isSubmitting === item.id}>
							<Trash className='h-4 w-4 text-destructive' />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This will permanently delete the {noun.toLowerCase()} &quot;{item.name}&quot;.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => handleDelete(item.id!)}
								className='bg-destructive hover:bg-destructive/90'
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</Card>
	);

	return (
		<>
			<div className='space-y-2'>
				<h1 className='text-3xl font-headline font-bold'>{title}</h1>
				<p className='text-muted-foreground'>{description}</p>
			</div>
			<Card className='glassmorphism'>
				<CardContent className='pt-6'>
					<div className='flex flex-col md:flex-row md:items-center gap-4'>
						<div className='relative w-full md:max-w-xs'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder={`Search ${noun.toLowerCase()}s...`}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='pl-10'
							/>
						</div>
						<div className='flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
							<FormAutocomplete
								control={undefined as any}
								name='countryFilter'
								label=''
								placeholder='Filter by Country...'
								options={[
									{ value: 'all', label: 'All Countries' },
									...countries?.map((c) => ({ value: c.code!, label: c.name })),
								]}
								onValueChange={setCountryFilter}
								value={countryFilter}
							/>
							<FormAutocomplete
								control={undefined as any}
								name='organizationTypeFilter'
								label=''
								placeholder='Filter by Type...'
								options={[
									{ value: 'all', label: 'All Types' },
									...organizationTypes?.map((c) => ({ value: c.id!, label: c.name })),
								]}
								onValueChange={setOrganizationTypeFilter}
								value={organizationTypeFilter}
							/>
							<FormAutocomplete
								control={undefined as any}
								name='industryFilter'
								label=''
								placeholder='Filter by Industry...'
								options={[
									{ value: 'all', label: 'All Industries' },
									...industryTypes?.map((i) => ({ value: i.id!, label: i.name })),
								]}
								onValueChange={setIndustryFilter}
								value={industryFilter}
							/>
						</div>
						<Button className='w-full md:w-auto' onClick={() => handleOpenForm()}>
							<PlusCircle className='mr-2 h-4 w-4' />
							Add {noun}
						</Button>
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
				<OrganizationForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					countries={countries}
					industryTypes={industryTypes}
					organizationTypes={organizationTypes}
					noun={noun}
				/>
			)}
		</>
	);
}
