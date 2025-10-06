
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { IOutsourcingCategory, IOutsourcingCharge, IOutsourcingZone } from '@/interfaces/master-data.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, PlusCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

const formSchema = z.object({
	categoryId: z.coerce.number().min(1, 'Category is required.'),
	zoneId: z.coerce.number().min(1, 'Zone is required.'),
	monthlyServiceCharge: z.coerce.number().min(1, 'Monthly Service Charge is required.'),
});
type FormValues = z.infer<typeof formSchema>;

interface OutsourcingChargeFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: IOutsourcingCharge | Omit<IOutsourcingCharge, 'id'>) => Promise<boolean>;
	initialData?: IOutsourcingCharge;
	categories: IOutsourcingCategory[];
	zones: IOutsourcingZone[];
	noun: string;
}

function OutsourcingChargeForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	categories,
	zones,
	noun,
}: OutsourcingChargeFormProps) {
	const defaultValues = {
		categoryId: initialData?.categoryId,
		zoneId: initialData?.zoneId,
		monthlyServiceCharge: initialData?.monthlyServiceCharge,
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
						{initialData ? 'Update the details.' : `Enter the details for the new ${noun.toLowerCase()}.`}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormAutocomplete
							control={form.control}
							name='categoryId'
							label='Category'
							placeholder='Select Category'
							required
							options={categories.map((c) => ({ value: c.id!, label: c.nameEn }))}
							disabled={isSubmitting}
						/>
						<FormAutocomplete
							control={form.control}
							name='zoneId'
							label='Zone'
							placeholder='Select Zone'
							required
							options={zones.map((z) => ({ value: z.id!, label: z.nameEn }))}
							disabled={isSubmitting}
						/>
						<FormInput
							control={form.control}
							name='monthlyServiceCharge'
							label='Monthly Service Charge'
							type='number'
							placeholder='e.g., 5000'
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

interface OutsourcingChargeCrudProps {
	title: string;
	description: string;
	noun: string;
	items: IOutsourcingCharge[];
	meta: IMeta;
	isLoading: boolean;
	categories: IOutsourcingCategory[];
	zones: IOutsourcingZone[];
	onAdd: (item: Omit<IOutsourcingCharge, 'id'>) => Promise<boolean>;
	onUpdate: (item: IOutsourcingCharge) => Promise<boolean>;
	onDelete: (id: number) => Promise<boolean>;
	onPageChange: (page: number) => void;
}

export function OutsourcingChargeCrud({
	title,
	description,
	noun,
	items,
	meta,
	isLoading,
	categories,
	zones,
	onAdd,
	onUpdate,
	onDelete,
	onPageChange,
}: OutsourcingChargeCrudProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<IOutsourcingCharge | undefined>(undefined);

	const handleOpenForm = (item?: IOutsourcingCharge) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: IOutsourcingCharge | Omit<IOutsourcingCharge, 'id'>) => {
		if ('id' in data) {
			return onUpdate(data as IOutsourcingCharge);
		}
		return onAdd(data as Omit<IOutsourcingCharge, 'id'>);
	};

	const handleToggleActive = async (item: IOutsourcingCharge) => {
		if (!item.id) return;
		setIsSubmitting(item.id.toString());
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

	const handleRemove = async (id?: number) => {
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
					<div className='space-y-2 pt-4'>
						{isLoading
							? [...Array(5)].map((_, i) => <Skeleton key={i} className='h-16 w-full' />)
							: items.map((item) => (
									<Card
										key={item.id}
										className='p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background/50'
									>
										<div className='flex-1 mb-4 sm:mb-0'>
											<p className='font-semibold'>{item.category?.nameEn}</p>
											<p className='text-sm text-muted-foreground'>
												Zone: {item.zone?.nameEn} | Charge: {item.monthlyServiceCharge}
											</p>
										</div>
										<div className='flex items-center gap-2 w-full sm:w-auto justify-between'>
											<div className='flex items-center gap-2'>
												<Switch
													checked={item.isActive}
													onCheckedChange={() => handleToggleActive(item)}
													disabled={isSubmitting === item.id?.toString()}
												/>
												<Label className='text-sm'>{item.isActive ? 'Active' : 'Inactive'}</Label>
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
													trigger={
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
															disabled={isSubmitting === item.id?.toString()}
														>
															<Trash className='h-4 w-4 text-danger' />
														</Button>
													}
													description={`This will permanently delete the charge for ${item.category?.nameEn} in ${item.zone?.nameEn}.`}
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
						<Pagination meta={meta} isLoading={isLoading} onPageChange={onPageChange} noun={noun} />
					</CardFooter>
				) : null}
			</Card>

			{isFormOpen && (
				<OutsourcingChargeForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					categories={categories}
					zones={zones}
					noun={noun}
				/>
			)}
		</div>
	);
}
