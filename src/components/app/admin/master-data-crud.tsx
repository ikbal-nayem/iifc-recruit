
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface MasterDataItem {
	id?: string;
	name: string;
	isActive: boolean;
}

const formSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
});
type FormValues = z.infer<typeof formSchema>;

interface MasterDataFormProps<T extends MasterDataItem> {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: FormValues, id?: string) => Promise<boolean | null>;
	initialData?: T;
	noun: string;
}

function MasterDataForm<T extends MasterDataItem>({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	noun,
}: MasterDataFormProps<T>) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: initialData?.name || '' },
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const success = await onSubmit(data, initialData?.id);
		if (success) {
			onClose();
			form.reset();
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add ${noun}`}</DialogTitle>
					<DialogDescription>
						{initialData ? 'Update the details.' : `Enter the details for the new ${noun.toLowerCase()}.`}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormInput
							control={form.control}
							name='name'
							label='Name'
							placeholder={`${noun} Name`}
							required
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

interface MasterDataCrudProps<T extends MasterDataItem> {
	title: string;
	description: string;
	noun: string;
	items: T[];
	meta: IMeta;
	isLoading: boolean;
	onAdd: (name: string) => Promise<boolean | null>;
	onUpdate: (item: T) => Promise<boolean | null>;
	onDelete: (id: string) => Promise<boolean>;
	onToggle?: (id: string) => Promise<T | boolean | null>;
	onPageChange?: (page: number) => void;
	onSearch: (query: string) => void;
}

export function MasterDataCrud<T extends MasterDataItem>({
	title,
	description,
	noun,
	items,
	meta,
	isLoading,
	onAdd,
	onUpdate,
	onDelete,
	onPageChange,
	onSearch,
}: MasterDataCrudProps<T>) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<T | undefined>(undefined);

	const handleOpenForm = (item?: T) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: FormValues, id?: string) => {
		if (editingItem && id) {
			const payload = { ...editingItem, name: data.name };
			return onUpdate(payload);
		} else {
			return onAdd(data.name);
		}
	};

	const handleToggleActive = async (item: T) => {
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
						<div className='relative w-full sm:max-w-xs'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder={`Search ${noun.toLowerCase()}s...`}
								onChange={(e) => onSearch(e.target.value)}
								className='pl-10'
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
											<p
												className={`font-semibold ${!item.isActive && 'text-muted-foreground line-through'}`}
											>
												{item.name}
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
												<ConfirmationDialog
													trigger={
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
															disabled={isSubmitting === item.id}
														>
															<Trash className='h-4 w-4 text-danger' />
														</Button>
													}
													description={`This will permanently delete the ${noun.toLowerCase()} "${
														item.name
													}".`}
													onConfirm={() => handleRemove(item.id)}
												/>
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
						{onPageChange && <Pagination meta={meta} isLoading={isLoading} onPageChange={onPageChange} noun={noun} />}
					</CardFooter>
				) : null}
			</Card>

			{isFormOpen && (
				<MasterDataForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun={noun}
				/>
			)}
		</div>
	);
}
