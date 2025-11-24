
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { isBangla, isEnglish } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
	nameEn: z.string().min(1, 'English name is required.').max(100, 'Name must be at most 100 characters').refine(isEnglish, {
		message: 'Only English characters, numbers, and some special characters are allowed.',
	}),
	nameBn: z.string().min(1, 'Bengali name is required.').max(100, 'Name must be at most 100 characters').refine(isBangla, {
		message: 'Only Bengali characters, numbers, and some special characters are allowed.',
	}),
	serial: z.number().optional(),
});
type FormValues = z.infer<typeof formSchema>;

interface MasterDataFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: FormValues, id?: string) => Promise<boolean | null>;
	initialData?: ICommonMasterData;
	noun: string;
	hasSerial?: boolean;
}

function MasterDataForm({ isOpen, onClose, onSubmit, initialData, noun, hasSerial }: MasterDataFormProps) {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		values: initialData || { nameEn: '', nameBn: '' },
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
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4' noValidate>
						<FormInput
							control={form.control}
							name='nameEn'
							label='Name (English)'
							placeholder='e.g., Data Entry'
							required
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='nameBn'
							label='Name (Bangla)'
							placeholder='e.g., ডেটা এন্ট্রি'
							required
							disabled={isSubmitting}
						/>
						{hasSerial && (
							<FormInput
								control={form.control}
								name='serial'
								label='Serial'
								placeholder='e.g., 1'
								required
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

interface MasterDataCrudProps {
	title: string;
	description: string;
	noun: string;
	items: ICommonMasterData[];
	meta: IMeta;
	isLoading: boolean;
	onAdd: (data: { nameEn: string; nameBn: string }) => Promise<boolean | null>;
	onUpdate: (item: ICommonMasterData) => Promise<boolean | null>;
	onDelete: (id: string) => Promise<boolean>;
	onPageChange?: (page: number) => void;
	onSearch: (query: string) => void;
	hasSerial?: boolean;
}

export function MasterDataCrud({
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
	hasSerial,
}: MasterDataCrudProps) {
	const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<ICommonMasterData | undefined>(undefined);
	const [itemToDelete, setItemToDelete] = useState<ICommonMasterData | null>(null);

	const handleOpenForm = (item?: ICommonMasterData) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: FormValues, id?: string) => {
		if (editingItem && id) {
			const payload = { ...editingItem, nameEn: data.nameEn, nameBn: data.nameBn };
			return onUpdate(payload);
		} else {
			return onAdd(data);
		}
	};

	const handleToggleActive = async (item: ICommonMasterData) => {
		if (!item.id) return;
		setIsSubmitting(item.id.toString());
		const success = await onUpdate({ ...item, active: !item.active });
		if (success) {
			toast.success({
				title: 'Success',
				description: 'Status updated successfully.',
			});
		}
		setIsSubmitting(null);
	};

	const handleRemove = async () => {
		if (!itemToDelete?.id) return;
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
				<CardContent className='space-y-4 pt-6 relative'>
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
					{isLoading && items.length > 0 && (
						<div className='absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10 mt-20'>
							<Loader2 className='h-8 w-8 animate-spin text-primary' />
						</div>
					)}
					<div className='space-y-2 pt-4'>
						{isLoading && items.length === 0 ? (
							[...Array(5)].map((_, i) => <Skeleton key={i} className='h-16 w-full' />)
						) : items.map((item) => (
									<Card
										key={item.id}
										className='p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background/50'
									>
										<div className='flex-1 mb-4 sm:mb-0'>
											<p className={`font-semibold ${!item.active && 'text-muted-foreground line-through'}`}>
												{item.nameEn}
											</p>
											<p className='text-sm text-muted-foreground'>{item.nameBn}</p>
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
						{onPageChange && (
							<Pagination meta={meta} isLoading={isLoading} onPageChange={onPageChange} noun={noun} />
						)}
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
					hasSerial={hasSerial}
				/>
			)}
			<ConfirmationDialog
				open={!!itemToDelete}
				onOpenChange={(open) => !open && setItemToDelete(null)}
				description={`This will permanently delete the ${noun.toLowerCase()} "${itemToDelete?.nameEn}".`}
				onConfirm={handleRemove}
			/>
		</div>
	);
}
