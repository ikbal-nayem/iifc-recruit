
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
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Search, Trash, Mail, Phone, Globe } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	countryCode: z.string().min(1, 'Country is required.'),
	address: z.string().optional(),
	industryTypeId: z.string().optional(),
	organizationTypeId: z.string().min(1, 'Organization Type is required'),
    phone: z.string().optional(),
    email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
    website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
});
type FormValues = z.infer<typeof formSchema>;

interface OrganizationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: Omit<IOrganization, 'id'>) => Promise<boolean>;
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
	const defaultValues = initialData || {
        name: '',
        countryCode: countries.find((c) => c.name === 'Bangladesh')?.code || '',
        address: '',
        industryTypeId: '',
        organizationTypeId: '',
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
        const payload: Omit<IOrganization, 'id'> = {
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
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add New ${noun}`}</DialogTitle>
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
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput
                                control={form.control}
                                name="phone"
                                label="Phone"
                                placeholder="Contact number"
                                disabled={isSubmitting}
                                startIcon={<Phone className="h-4 w-4 text-muted-foreground" />}
                            />
                             <FormInput
                                control={form.control}
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Contact email"
                                disabled={isSubmitting}
                                startIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
                            />
                        </div>
                        <FormInput
							control={form.control}
							name='website'
							label='Website'
                            type="url"
							placeholder='https://example.com'
							disabled={isSubmitting}
                            startIcon={<Globe className="h-4 w-4 text-muted-foreground" />}
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

interface OrganizationCrudProps {
	title: string;
	description: string;
	noun: string;
	items: IOrganization[];
	meta: IMeta;
	isLoading: boolean;
	countries: ICommonMasterData[];
	industryTypes: ICommonMasterData[];
	organizationTypes: ICommonMasterData[];
	onAdd: (item: Omit<IOrganization, 'id'>) => Promise<boolean>;
	onUpdate: (item: IOrganization) => Promise<boolean>;
	onDelete: (id: string) => Promise<boolean>;
	onPageChange: (page: number) => void;
	onSearch: (query: string) => void;
	countryFilter: string;
	onCountryChange: (id: string) => void;
	industryFilter: string;
	onIndustryChange: (id: string) => void;
}

export function OrganizationCrud({
	title,
	description,
	noun,
	items,
	meta,
	isLoading,
	countries,
	industryTypes,
	organizationTypes,
	onAdd,
	onUpdate,
	onDelete,
	onPageChange,
	onSearch,
	countryFilter,
	onCountryChange,
	industryFilter,
	onIndustryChange,
}: OrganizationCrudProps) {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<IOrganization | undefined>(undefined);
	const { toast } = useToast();

	const handleOpenForm = (item?: IOrganization) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: Omit<IOrganization, 'id'>) => {
		const success = editingItem ? await onUpdate({ ...editingItem, ...data}) : await onAdd(data);
		if (success) handleCloseForm();
		return success;
	};

	const handleToggleActive = async (item: IOrganization) => {
		const success = await onUpdate({ ...item, isActive: !item.isActive });
		if (success) {
			toast({
				title: 'Success',
				description: 'Status updated successfully.',
				variant: 'success',
			});
		}
	};

	const from = meta.totalRecords ? meta.page * meta.limit + 1 : 0;
	const to = Math.min((meta.page + 1) * meta.limit, meta.totalRecords || 0);

	const renderViewItem = (item: IOrganization) => (
		<Card key={item.id} className='p-4 flex flex-col sm:flex-row justify-between items-start bg-background/50 gap-4'>
			<div className='flex-1 space-y-1'>
				<p className={`font-semibold ${!item.isActive && 'text-muted-foreground line-through'}`}>{item.name}</p>
                <div className="text-xs text-muted-foreground space-y-1">
                    <p>
                        {countries.find((c) => c.code === item.countryCode)?.name} | Industry:{' '}
                        {industryTypes.find((i) => i.id === item.industryTypeId)?.name || 'N/A'} | Type:{' '}
                        {organizationTypes.find((o) => o.id === item.organizationTypeId)?.name || 'N/A'}
                    </p>
                    {item.address && <p className='text-xs text-muted-foreground'>{item.address}</p>}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                        {item.phone && <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {item.phone}</span>}
                        {item.email && <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {item.email}</span>}
                        {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:underline"><Globe className="h-3 w-3" /> Website</a>}
                    </div>
                </div>
			</div>
			<div className='flex items-center gap-2 self-start'>
				<Switch checked={item.isActive} onCheckedChange={() => handleToggleActive(item)} />
				<Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => handleOpenForm(item)}>
					<Edit className='h-4 w-4' />
				</Button>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant='ghost' size='icon' className='h-8 w-8'>
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
							<AlertDialogAction onClick={() => onDelete(item.id!)} className='bg-destructive hover:bg-destructive/90'>
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
								onChange={(e) => onSearch(e.target.value)}
								className='pl-10'
							/>
						</div>
						<div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormAutocomplete
								control={undefined as any}
								name='countryFilter'
								label=''
								placeholder='Filter by Country...'
								options={[{ value: 'all', label: 'All Countries' }, ...countries.map((c) => ({ value: c.id!, label: c.name }))]}
								onValueChange={onCountryChange}
								value={countryFilter}
							/>
							<FormAutocomplete
								control={undefined as any}
								name='industryFilter'
								label=''
								placeholder='Filter by Industry...'
								options={[{ value: 'all', label: 'All Industries' }, ...industryTypes.map((i) => ({ value: i.id!, label: i.name }))]}
								onValueChange={onIndustryChange}
								value={industryFilter}
							/>
						</div>
						<Button className='w-full md:w-auto' onClick={() => handleOpenForm()}>
							<PlusCircle className='mr-2 h-4 w-4' />
							Add New {noun}
						</Button>
					</div>
					<div className='space-y-2 pt-4'>
						{isLoading
							? [...Array(5)].map((_, i) => <Skeleton key={i} className='h-20 w-full' />)
							: items.map(renderViewItem)}
						{!isLoading && items.length === 0 && (
							<p className='text-center text-sm text-muted-foreground py-4'>No {noun.toLowerCase()}s found.</p>
						)}
					</div>
				</CardContent>
				{meta && meta.totalRecords && meta.totalRecords > 0 ? (
					<CardFooter className='flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between'>
						<p className='text-sm text-muted-foreground'>
							Showing{' '}
							<strong>
								{from}-{to}
							</strong>{' '}
							of <strong>{meta.totalRecords}</strong> {noun.toLowerCase()}s
						</p>
						<Pagination meta={meta} isLoading={isLoading} onPageChange={onPageChange} />
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
