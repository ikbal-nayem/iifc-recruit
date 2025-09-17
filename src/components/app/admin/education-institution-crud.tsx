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
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IEducationInstitution } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Edit, Loader2, PlusCircle, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	countryId: z.string().min(1, 'Country is required.'),
});
type FormValues = z.infer<typeof formSchema>;

interface EducationInstitutionFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: IEducationInstitution | Omit<IEducationInstitution, 'id'>) => Promise<boolean>;
	initialData?: IEducationInstitution;
	countries: ICommonMasterData[];
	noun: string;
}

function EducationInstitutionForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	countries,
	noun,
}: EducationInstitutionFormProps) {
	const defaultValues = {
		name: initialData?.name || '',
		countryId: initialData?.countryId || '',
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const payload = {
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

	useState(() => {
		form.reset(defaultValues);
	});

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add New ${noun}`}</DialogTitle>
					<DialogDescription>
						{initialData
							? 'Update the details of the institution.'
							: `Enter the details for the new ${noun.toLowerCase()}.`}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='Institution Name' {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='countryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant='outline'
													role='combobox'
													className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
													disabled={isSubmitting}
												>
													{field.value ? countries.find((c) => c.id === field.value)?.name : 'Select Country'}
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
																	form.setValue('countryId', c.id!);
																}}
															>
																<Check
																	className={cn(
																		'mr-2 h-4 w-4',
																		field.value === c.id ? 'opacity-100' : 'opacity-0'
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
						<AlertDialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								{initialData ? 'Save Changes' : 'Add'}
							</Button>
						</AlertDialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

interface EducationInstitutionCrudProps {
	title: string;
	description: string;
	noun: string;
	items: IEducationInstitution[];
	meta: IMeta;
	isLoading: boolean;
	countries: ICommonMasterData[];
	onAdd: (item: Omit<IEducationInstitution, 'id'>) => Promise<boolean>;
	onUpdate: (item: IEducationInstitution) => Promise<boolean>;
	onDelete: (id: string) => Promise<boolean>;
	onPageChange: (page: number) => void;
	onSearch: (query: string) => void;
	countryFilter: string;
	onCountryChange: (countryId: string) => void;
}

const PaginationControls = ({
	meta,
	isLoading,
	onPageChange,
}: {
	meta: IMeta;
	isLoading: boolean;
	onPageChange: (page: number) => void;
}) => {
	const currentPage = meta.page;
	const totalPages = meta.totalPageCount || 1;

	const renderPageNumbers = () => {
		const pageNumbers = [];
		const maxPagesToShow = 5;
		const ellipsis = <span className='px-2 py-1'>...</span>;

		if (totalPages <= maxPagesToShow + 2) {
			for (let i = 0; i < totalPages; i++) {
				pageNumbers.push(
					<Button
						key={i}
						variant={currentPage === i ? 'default' : 'outline'}
						size='sm'
						onClick={() => onPageChange(i)}
						disabled={isLoading}
					>
						{i + 1}
					</Button>
				);
			}
		} else {
			// Always show first page
			pageNumbers.push(
				<Button
					key={0}
					variant={currentPage === 0 ? 'default' : 'outline'}
					size='sm'
					onClick={() => onPageChange(0)}
					disabled={isLoading}
				>
					1
				</Button>
			);

			let startPage = Math.max(1, currentPage - 1);
			let endPage = Math.min(totalPages - 2, currentPage + 1);

			if (currentPage < 3) {
				startPage = 1;
				endPage = 3;
			} else if (currentPage > totalPages - 4) {
				startPage = totalPages - 4;
				endPage = totalPages - 2;
			}
			
			if (startPage > 1) {
				pageNumbers.push(ellipsis);
			}

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(
					<Button
						key={i}
						variant={currentPage === i ? 'default' : 'outline'}
						size='sm'
						onClick={() => onPageChange(i)}
						disabled={isLoading}
					>
						{i + 1}
					</Button>
				);
			}
			
			if (endPage < totalPages - 2) {
				pageNumbers.push(ellipsis);
			}

			// Always show last page
			pageNumbers.push(
				<Button
					key={totalPages - 1}
					variant={currentPage === totalPages - 1 ? 'default' : 'outline'}
					size='sm'
					onClick={() => onPageChange(totalPages - 1)}
					disabled={isLoading}
				>
					{totalPages}
				</Button>
			);
		}

		return pageNumbers;
	};

	return (
		<div className='flex items-center space-x-2'>
			<Button variant='outline' size='sm' onClick={() => onPageChange(meta.prevPage ?? 0)} disabled={!meta.prevPage || isLoading}>
				Previous
			</Button>
			<div className='hidden md:flex items-center gap-1'>{renderPageNumbers()}</div>
			<Button variant='outline' size='sm' onClick={() => onPageChange(meta.nextPage ?? 0)} disabled={!meta.nextPage || isLoading}>
				Next
			</Button>
		</div>
	);
};

export function EducationInstitutionCrud({
	title,
	description,
	noun,
	items,
	meta,
	isLoading,
	countries,
	onAdd,
	onUpdate,
	onDelete,
	onPageChange,
	onSearch,
	countryFilter,
	onCountryChange,
}: EducationInstitutionCrudProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
	const [countryFilterPopoverOpen, setCountryFilterPopoverOpen] = useState(false);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<IEducationInstitution | undefined>(undefined);

	const handleOpenForm = (item?: IEducationInstitution) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: IEducationInstitution | Omit<IEducationInstitution, 'id'>) => {
		if ('id' in data) {
			return onUpdate(data as IEducationInstitution);
		}
		return onAdd(data as Omit<IEducationInstitution, 'id'>);
	};

	const handleToggleActive = async (item: IEducationInstitution) => {
		if (!item.id) return;
		setIsSubmitting(item.id);
		const success = await onUpdate({ ...item, isActive: !item.isActive });
		if (success) {
			toast({
				title: 'Success',
				description: 'Status updated successfully.',
				variant: 'success',
			});
		}
		setIsSubmitting(null);
	};

	const handleRemove = async (id?: string) => {
		if (!id) return;
		await onDelete(id);
	};

	const renderViewItem = (item: IEducationInstitution) => (
		<Card
			key={item.id}
			className='p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background/50'
		>
			<div className='flex-1 mb-4 sm:mb-0'>
				<p className={`font-semibold ${!item.isActive && 'text-muted-foreground line-through'}`}>
					{item.name}
				</p>
				<p className='text-sm text-muted-foreground'>
					{countries.find((c) => c.id === item.countryId)?.name || 'Unknown Country'}
				</p>
			</div>
			<div className='flex items-center gap-2 w-full sm:w-auto justify-between'>
				<div className='flex items-center gap-2'>
					<Switch
						checked={item.isActive}
						onCheckedChange={() => handleToggleActive(item)}
						disabled={isSubmitting === item.id}
					/>
					<Label className='text-sm'>{item.isActive ? 'Active' : 'Inactive'}</Label>
				</div>
				<div className='flex'>
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
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This will permanently delete the {noun.toLowerCase()} <strong>&quot;{item.name}&quot;</strong>.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={() => handleRemove(item.id)}
									className='bg-destructive hover:bg-destructive/90'
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</Card>
	);

	const from = meta.totalRecords ? meta.page * meta.limit + 1 : 0;
	const to = Math.min((meta.page + 1) * meta.limit, meta.totalRecords || 0);

	return (
		<>
			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex flex-col sm:flex-row gap-4 justify-between'>
						<div className='flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='relative w-full'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder={`Search ${noun.toLowerCase()}s...`}
									onChange={(e) => onSearch(e.target.value)}
									className='pl-10'
								/>
							</div>
							<Popover open={countryFilterPopoverOpen} onOpenChange={setCountryFilterPopoverOpen}>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										role='combobox'
										aria-expanded={countryFilterPopoverOpen}
										className='w-full justify-between'
									>
										{countryFilter === 'all'
											? 'All Countries'
											: countries.find((c) => c.id === countryFilter)?.name || 'All Countries'}
										<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
									<Command>
										<CommandInput placeholder='Search country...' />
										<CommandList>
											<CommandEmpty>No country found.</CommandEmpty>
											<CommandGroup>
												<CommandItem
													value='all'
													onSelect={() => {
														onCountryChange('all');
														setCountryFilterPopoverOpen(false);
													}}
												>
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															countryFilter === 'all' ? 'opacity-100' : 'opacity-0'
														)}
													/>
													All Countries
												</CommandItem>
												{countries.map((c) => (
													<CommandItem
														key={c.id}
														value={c.name}
														onSelect={() => {
															onCountryChange(c.id!);
															setCountryFilterPopoverOpen(false);
														}}
													>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																countryFilter === c.id ? 'opacity-100' : 'opacity-0'
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
						</div>
						<Button className='w-full sm:w-auto' onClick={() => handleOpenForm()}>
							<PlusCircle className='mr-2 h-4 w-4' />
							Add New {noun}
						</Button>
					</div>
					<div className='space-y-2 pt-4'>
						{isLoading
							? [...Array(5)].map((_, i) => <Skeleton key={i} className='h-16 w-full' />)
							: items.map(renderViewItem)}
						{!isLoading && items.length === 0 && (
							<p className='text-center text-sm text-muted-foreground py-4'>
								No {noun.toLowerCase()}s found.
							</p>
						)}
					</div>
				</CardContent>
				{meta && meta.totalRecords && meta.totalRecords > 0 && (
					<CardFooter className='flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between'>
						<p className='text-sm text-muted-foreground'>
							Showing{' '}
							<strong>
								{from}-{to}
							</strong>{' '}
							of <strong>{meta.totalRecords}</strong> institutions
						</p>
						<PaginationControls meta={meta} isLoading={isLoading} onPageChange={onPageChange} />
					</CardFooter>
				)}
			</Card>

			{isFormOpen && (
				<EducationInstitutionForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					countries={countries}
					noun={noun}
				/>
			)}
		</>
	);
}
