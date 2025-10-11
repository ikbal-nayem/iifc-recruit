'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { IOutsourcingCategory, IPost } from '@/interfaces/master-data.interface';
import { isBangla, isEnglish } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { FormCheckbox } from '@/components/ui/form-checkbox';

const formSchema = z
	.object({
		nameEn: z
			.string()
			.min(1, 'English name is required.')
			.refine(isEnglish, 'Only English characters are allowed.'),
		nameBn: z
			.string()
			.min(1, 'Bengali name is required.')
			.refine(isBangla, 'Only Bengali characters are allowed.'),
		outsourcing: z.boolean().default(false),
		outsourcingCategoryId: z.coerce.number().optional(),
	})
	.refine((data) => !data.outsourcing || (data.outsourcing && data.outsourcingCategoryId), {
		message: 'Category is required for outsourcing posts.',
		path: ['outsourcingCategoryId'],
	});

type FormValues = z.infer<typeof formSchema>;

interface PostFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: IPost | Omit<IPost, 'id'>) => Promise<boolean>;
	initialData?: IPost;
	categories: IOutsourcingCategory[];
	noun: string;
}

function PostForm({ isOpen, onClose, onSubmit, initialData, categories, noun }: PostFormProps) {
	const defaultValues = {
		nameEn: initialData?.nameEn || '',
		nameBn: initialData?.nameBn || '',
		outsourcing: initialData?.outsourcing || false,
		outsourcingCategoryId: initialData?.outsourcingCategoryId,
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const watchOutsourcing = form.watch('outsourcing');

	const handleSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const payload = {
			...initialData,
			...data,
			active: initialData?.active ?? true,
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
							? 'Update the details of the post.'
							: `Enter the details for the new ${noun.toLowerCase()}.`}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormInput
							control={form.control}
							name='nameEn'
							label='Name (English)'
							placeholder='Post Name'
							required
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='nameBn'
							label='Name (Bangla)'
							placeholder='পোস্টের নাম'
							required
							disabled={isSubmitting}
						/>
						<FormCheckbox control={form.control} name='outsourcing' label='This is an outsourcing post' />
						{watchOutsourcing && (
							<FormAutocomplete
								control={form.control}
								name='outsourcingCategoryId'
								label='Outsourcing Category'
								placeholder='Select Category'
								required
								options={categories}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option?.nameEn}
								disabled={isSubmitting}
							/>
						)}
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

interface PostCrudProps {
	title: string;
	description: string;
	noun: string;
	items: IPost[];
	meta: IMeta;
	isLoading: boolean;
	categories: IOutsourcingCategory[];
	onAdd: (item: Omit<IPost, 'id'>) => Promise<boolean>;
	onUpdate: (item: IPost) => Promise<boolean>;
	onDelete: (id: string) => Promise<boolean>;
	onPageChange: (page: number) => void;
	onSearch: (query: string) => void;
	categoryFilter: string;
	onCategoryChange: (outsourcingCategoryId: string) => void;
}

export function PostCrud({
	title,
	description,
	noun,
	items,
	meta,
	isLoading,
	categories,
	onAdd,
	onUpdate,
	onDelete,
	onPageChange,
	onSearch,
	categoryFilter,
	onCategoryChange,
}: PostCrudProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<IPost | undefined>(undefined);
	const [itemToDelete, setItemToDelete] = useState<IPost | null>(null);

	const handleOpenForm = (item?: IPost) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: IPost | Omit<IPost, 'id'>) => {
		if ('id' in data) {
			return onUpdate(data as IPost);
		}
		return onAdd(data as Omit<IPost, 'id'>);
	};

	const handleToggleActive = async (item: IPost) => {
		if (!item.id) return;
		setIsSubmitting(item.id.toString());
		const success = await onUpdate({ ...item, active: !item.active });
		if (success) {
			toast({
				title: 'Success',
				description: 'Status updated successfully.',
				variant: 'success',
			});
		}
		setIsSubmitting(null);
	};

	const handleRemove = async () => {
		if (!itemToDelete || !itemToDelete.id) return;
		await onDelete(itemToDelete.id.toString());
		setItemToDelete(null);
	};

	return (
		<div className='space-y-8'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-headline font-bold'>{title}</h1>
					<p className='text-muted-foreground'>{description}</p>
				</div>
				<Button className='w-full sm:w-auto' onClick={() => handleOpenForm()}>
					<PlusCircle className='mr-2 h-4 w-4' />
					Add New {noun}
				</Button>
			</div>
			<Card className='glassmorphism'>
				<CardContent className='space-y-4 pt-6'>
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
							<FormAutocomplete
								control={undefined as any}
								name='categoryFilter'
								label=''
								placeholder='Filter by Category...'
								options={[{ id: 'all', nameEn: 'All Categories' }, ...categories]}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
								onValueChange={(val) => onCategoryChange(val.toString())}
								value={categoryFilter}
							/>
						</div>
					</div>
					<div className='space-y-2 pt-4'>
						{isLoading
							? [...Array(5)].map((_, i) => <Skeleton key={i} className='h-16 w-full' />)
							: items.map((item) => (
									<Card
										key={item.id}
										className='p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background/50'
									>
										<div className='flex-1 mb-4 sm:mb-0'>
											<p className={`font-semibold ${!item.active && 'text-muted-foreground line-through'}`}>
												{item.nameEn}
											</p>
											<p className='text-sm text-muted-foreground'>{item.nameBn}</p>
											<p className='text-xs text-muted-foreground'>
												Category:{' '}
												{categories.find((c) => c.id === item.outsourcingCategoryId)?.nameEn || 'N/A'}
											</p>
										</div>
										<div className='flex items-center gap-2 w-full sm:w-auto justify-between'>
											<div className='flex items-center gap-2'>
												<Switch
													checked={item.active}
													onCheckedChange={() => handleToggleActive(item)}
													disabled={isSubmitting === item.id?.toString()}
												/>
												<Label className='text-sm'>{item.active ? 'Active' : 'Inactive'}</Label>
											</div>
											<div className='flex'>
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
													open={itemToDelete?.id === item.id}
													onOpenChange={(open) => !open && setItemToDelete(null)}
													description={`This will permanently delete the ${noun.toLowerCase()} "${
														item.nameEn
													}".`}
													onConfirm={handleRemove}
												/>
												<Button
													variant='ghost'
													size='icon'
													className='h-8 w-8'
													onClick={() => setItemToDelete(item)}
													disabled={isSubmitting === item.id?.toString()}
												>
													<Trash className='h-4 w-4 text-danger' />
												</Button>
											</div>
										</div>
									</Card>
							  ))}
						{!isLoading && items.length === 0 && (
							<p className='text-center text-sm text-muted-foreground py-4'>
								No {noun.toLowerCase()}s found.
							</p>
						)}
					</div>
				</CardContent>
				{meta && meta.totalRecords && meta.totalRecords > 0 ? (
					<CardFooter>
						<Pagination meta={meta} isLoading={isLoading} onPageChange={onPageChange} noun={noun} />
					</CardFooter>
				) : null}
			</Card>

			{isFormOpen && (
				<PostForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					categories={categories}
					noun={noun}
				/>
			)}
		</div>
	);
}
