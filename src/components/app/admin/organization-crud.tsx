
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Edit, Loader2, PlusCircle, Search, Trash } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	fkCountry: z.string().min(1, 'Country is required.'),
	address: z.string().optional(),
	postCode: z.string().optional(),
	fkIndustryType: z.string().optional(),
	fkOrganizationType: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

interface OrganizationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: IOrganization | Omit<IOrganization, 'id'>) => Promise<boolean>;
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
	const defaultValues = useMemo(
		() =>
			initialData || {
				name: '',
				fkCountry: countries.find((c) => c.name === 'Bangladesh')?.name || '',
				address: '',
				postCode: '',
				fkIndustryType: '',
				fkOrganizationType: '',
			},
		[initialData, countries]
	);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const payload = { ...initialData, ...data, isActive: initialData?.isActive ?? true };
		const success = await onSubmit(payload);
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
	};

	useEffect(() => {
		form.reset(defaultValues);
	}, [defaultValues, form]);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add New ${noun}`}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormInput
							control={form.control}
							name='name'
							label='Name'
							placeholder='Organization Name'
							required
							disabled={isSubmitting}
						/>
						<FormField
							control={form.control}
							name='fkCountry'
							render={({ field }) => (
								<FormItem>
									<FormLabel required>Country</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant='outline'
													role='combobox'
													className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
													disabled={isSubmitting}
												>
													{field.value
														? countries.find((c) => c.name === field.value)?.name
														: 'Select Country'}
													<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
											<Command>
												<CommandInput placeholder='Search country...' />
												<CommandList>
													<CommandEmpty>No country found.</CommandEmpty>
													<CommandGroup>
														{countries.map((c) => (
															<CommandItem
																key={c.id}
																value={c.name}
																onSelect={() => {
																	form.setValue('fkCountry', c.name);
																}}
															>
																<Check
																	className={cn(
																		'mr-2 h-4 w-4',
																		field.value === c.name ? 'opacity-100' : 'opacity-0'
																	)}
																/>
																{c.name}
															</CommandItem>
														))}
													</CommandGroup>
												</CommandList>
											</Command>
										</PopoverContent>
									</Popover>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='grid grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='address'
								label='Address'
								placeholder='Address'
								disabled={isSubmitting}
							/>
							<FormInput
								control={form.control}
								name='postCode'
								label='Post Code'
								placeholder='Post Code'
								disabled={isSubmitting}
							/>
						</div>
						<FormSelect
							control={form.control}
							name='fkIndustryType'
							label='Industry Type'
							placeholder='Select Industry Type'
							options={industryTypes.map((type) => ({ label: type.name, value: type.name }))}
							disabled={isSubmitting}
						/>
						<FormSelect
							control={form.control}
							name='fkOrganizationType'
							label='Organization Type'
							placeholder='Select Organization Type'
							options={organizationTypes.map((type) => ({ label: type.name, value: type.name }))}
							disabled={isSubmitting}
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

	const handleFormSubmit = async (data: IOrganization | Omit<IOrganization, 'id'>) => {
		const success = 'id' in data ? await onUpdate(data) : await onAdd(data);
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
		<Card key={item.id} className='p-4 flex justify-between items-center bg-background/50'>
			<div className='flex-1 space-y-1'>
				<p className={`font-semibold ${!item.isActive && 'text-muted-foreground line-through'}`}>{item.name}</p>
				<p className='text-xs text-muted-foreground'>
					{item.fkCountry} | Industry: {item.fkIndustryType || 'N/A'} | Type: {item.fkOrganizationType || 'N/A'}
				</p>
				{item.address && <p className='text-xs text-muted-foreground'>{item.address}, {item.postCode}</p>}
			</div>
			<div className='flex items-center gap-2'>
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
					<div className='flex flex-col sm:flex-row gap-4 justify-between'>
						<div className='relative w-full sm:max-w-xs'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder={`Search ${noun.toLowerCase()}s...`}
								onChange={(e) => onSearch(e.target.value)}
								className='pl-10'
							/>
						</div>
						<Button className='w-full sm:w-auto' onClick={() => handleOpenForm()}>
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
