
'use client';

import { FormMasterData } from '@/app/(auth)/admin/master-data/organizations/page';
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
import { IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Globe, Loader2, Mail, Phone, PlusCircle, Search, Trash } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const formSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	countryCode: z.string().min(1, 'Country is required.'),
	organizationTypeId: z.coerce.number().min(1, 'Organization Type is required.'),
	industryTypeId: z.coerce.number().optional(),
	address: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
	website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;

interface OrganizationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: FormValues) => Promise<boolean>;
	initialData?: IOrganization;
	noun: string;
	masterData: FormMasterData;
}

function OrganizationForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	noun,
	masterData: { countries, industryTypes, organizationTypes },
}: OrganizationFormProps) {
	const defaultValues = initialData
		? { ...initialData, countryCode: initialData.country?.code }
		: {
				name: '',
				countryCode: countries.find((c) => c.name === 'Bangladesh')?.code || '',
				organizationTypeId: undefined,
				industryTypeId: undefined,
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
						<FormInput
							control={form.control}
							name='name'
							label='Name'
							placeholder='Organization Name'
							required
							disabled={isSubmitting}
						/>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormAutocomplete
								control={form.control}
								name='countryCode'
								label='Country'
								placeholder='Select Country'
								required
								options={countries}
								getOptionValue={(option) => option.code!}
								getOptionLabel={(option) => option.name}
								disabled={isSubmitting}
							/>
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
						</div>
						<FormAutocomplete
							control={form.control}
							name='industryTypeId'
							label='Industry Type'
							placeholder='Select Industry Type'
							options={industryTypes}
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
	masterData: FormMasterData;
}

export function OrganizationCrud({ title, description, noun, masterData }: OrganizationCrudProps) {
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
		async (page: number, search: string, countryCode: string, industryId: string, orgTypeId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						name: search,
						...(countryCode !== 'all' && { countryCode }),
						...(industryId !== 'all' && { industryTypeId: industryId }),
						...(orgTypeId !== 'all' && { organizationTypeId: orgTypeId }),
					},
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.organization.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load organizations.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
				setIsInitialLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		loadItems(0, '', 'all', 'all', 'all');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isInitialLoading) {
			loadItems(0, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
		}
	}, [debouncedSearch, countryFilter, industryFilter, organizationTypeFilter, isInitialLoading, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
	};

	const handleOpenForm = (item?: IOrganization) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: FormValues): Promise<boolean> => {
		const payload = {
			...data,
			isActive: editingItem?.isActive ?? true,
		};
		try {
			const isUpdate = editingItem?.id;
			const response = isUpdate
				? await MasterDataService.organization.update({ ...payload, id: editingItem.id })
				: await MasterDataService.organization.add(payload);

			toast({ description: response.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to save item', error);
			toast({ title: 'Error', description: error.message || `Failed to save ${noun}.`, variant: 'danger' });
			return false;
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await MasterDataService.organization.delete(id);
			toast({ title: 'Success', description: 'Organization deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter, industryFilter, organizationTypeFilter);
		} catch (error: any) {
			console.error('Failed to delete item', error);
			toast({
				title: 'Error',
				description: error?.message || 'Failed to delete organization.',
				variant: 'danger',
			});
		}
	};

	const handleToggleActive = async (item: IOrganization) => {
		if (!item.id) return;
		setIsSubmitting(item.id.toString());
		const updatedItem = { ...item, isActive: !item.isActive };
		try {
			await MasterDataService.organization.update(updatedItem);
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
						{item.country?.name} | Industry: {item.industryType?.name || 'N/A'} | Type:{' '}
						{item.organizationType?.name || 'N/A'}
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
					disabled={isSubmitting === item.id?.toString()}
				/>
				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8'
					onClick={() => handleOpenForm(item)}
					disabled={isSubmitting === item.id?.toString()}
				>
					<Edit className='h-4 w-4' />
				</Button>
				<ConfirmationDialog
					trigger={
						<Button variant='ghost' size='icon' className='h-8 w-8' disabled={isSubmitting === item.id?.toString()}>
							<Trash className='h-4 w-4 text-danger' />
						</Button>
					}
					description={`This will permanently delete the ${noun.toLowerCase()} "${item.name}".`}
					onConfirm={() => handleDelete(item.id!.toString())}
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
					<div className='flex flex-col lg:flex-row lg:items-center gap-4'>
						<div className='relative w-full lg:max-w-xs'>
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
								options={[{ id: 'all', name: 'All Countries', code: 'all' }, ...(masterData?.countries || [])]}
								getOptionValue={(option) => option.code!}
								getOptionLabel={(option) => option.name}
								onValueChange={(val) => setCountryFilter(val as string)}
								value={countryFilter}
							/>
							<FormAutocomplete
								control={undefined as any}
								name='organizationTypeFilter'
								label=''
								placeholder='Filter by Type...'
								options={[{ id: 'all', name: 'All Types' }, ...(masterData?.organizationTypes || [])]}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.name}
								onValueChange={(val) => setOrganizationTypeFilter(val as string)}
								value={organizationTypeFilter}
							/>
							<FormAutocomplete
								control={undefined as any}
								name='industryFilter'
								label=''
								placeholder='Filter by Industry...'
								options={[{ id: 'all', name: 'All Industries' }, ...(masterData?.industryTypes || [])]}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.name}
								onValueChange={(val) => setIndustryFilter(val as string)}
								value={industryFilter}
							/>
						</div>
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
					noun={noun}
					masterData={masterData}
				/>
			)}
		</div>
	);
}
