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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Edit, Loader2, PlusCircle, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { IMeta } from '@/interfaces/common.interface';
import { countries } from '@/lib/countries';

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
	industryTypes: ICommonMasterData[];
	organizationTypes: ICommonMasterData[];
	noun: string;
}

function OrganizationForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	industryTypes,
	organizationTypes,
	noun,
}: OrganizationFormProps) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			fkCountry: '',
			address: '',
			postCode: '',
			fkIndustryType: '',
			fkOrganizationType: '',
		},
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

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add New ${noun}`}</DialogTitle>
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
										<Input placeholder='Organization Name' {...field} disabled={isSubmitting} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='fkCountry'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select Country' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{countries.map((c) => (
												<SelectItem key={c.code} value={c.name}>
													{c.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='address'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input placeholder='Address' {...field} disabled={isSubmitting} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='postCode'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Post Code</FormLabel>
										<FormControl>
											<Input placeholder='Post Code' {...field} disabled={isSubmitting} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<FormField
							control={form.control}
							name='fkIndustryType'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Industry Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select Industry Type' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{industryTypes.map((type) => (
												<SelectItem key={type.id} value={type.name}>
													{type.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='fkOrganizationType'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Type</FormLabel>
									<Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select Organization Type' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{organizationTypes.map((type) => (
												<SelectItem key={type.id} value={type.name}>
													{type.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
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
	industryTypes: ICommonMasterData[];
	organizationTypes: ICommonMasterData[];
	onAdd: (item: Omit<IOrganization, 'id'>) => Promise<boolean>;
	onUpdate: (item: IOrganization) => Promise<boolean>;
	onDelete: (id: string) => Promise<boolean>;
	onPageChange: (page: number) => void;
	onSearch: (query: string) => void;
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

export function OrganizationCrud({
	title,
	description,
	noun,
	items,
	meta,
	isLoading,
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
			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
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
				{meta && meta.totalRecords && meta.totalRecords > 0 && (
					<CardFooter className='flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between'>
						<p className='text-sm text-muted-foreground'>
							Showing{' '}
							<strong>
								{from}-{to}
							</strong>{' '}
							of <strong>{meta.totalRecords}</strong> {noun.toLowerCase()}s
						</p>
						<PaginationControls meta={meta} isLoading={isLoading} onPageChange={onPageChange} />
					</CardFooter>
				)}
			</Card>
			{isFormOpen && (
				<OrganizationForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					industryTypes={industryTypes}
					organizationTypes={organizationTypes}
					noun={noun}
				/>
			)}
		</>
	);
}
