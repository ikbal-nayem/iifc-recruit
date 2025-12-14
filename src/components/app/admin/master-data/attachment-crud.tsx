
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
import { FilePreviewer } from '@/components/ui/file-previewer';
import { Form } from '@/components/ui/form';
import { FormFileUpload } from '@/components/ui/form-file-upload';
import { FormSelect } from '@/components/ui/form-select';
import { FormSwitch } from '@/components/ui/form-switch';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { IAttachment, IMeta } from '@/interfaces/common.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { makeFormData } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { FileText, Loader2, PlusCircle, Star, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z.object({
	type: z.string().min(1, 'Attachment type is required.'),
	file: z.any().refine((file) => file, 'File is required.'),
	isDefault: z.boolean().default(false),
});
type FormValues = z.infer<typeof formSchema>;

interface AttachmentFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: FormData) => Promise<boolean>;
	attachmentTypes: EnumDTO[];
	noun: string;
}

function AttachmentForm({ isOpen, onClose, onSubmit, attachmentTypes, noun }: AttachmentFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: '',
			file: null,
			isDefault: false,
		},
	});

	const handleSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const formData = makeFormData(data);
		const success = await onSubmit(formData);
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New {noun}</DialogTitle>
					<DialogDescription>Upload a file and select its type.</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 py-4'>
						<FormSelect
							control={form.control}
							name='type'
							label='Attachment Type'
							placeholder='Select a type'
							required
							options={attachmentTypes}
							getOptionValue={(option) => option.value}
							getOptionLabel={(option) => option.nameEn}
							disabled={isSubmitting}
						/>
						<FormFileUpload
							control={form.control}
							name='file'
							label='File'
							required
							accept='.pdf'
							maxSize={10 * 1024 * 1024}
							disabled={isSubmitting}
						/>
						<FormSwitch
							control={form.control}
							name='isDefault'
							label='Set as Default'
							description='If set, this will be the default file for this type.'
						/>
						<DialogFooter className='pt-4'>
							<Button type='button' variant='ghost' onClick={onClose} disabled={isSubmitting}>
								Cancel
							</Button>
							<Button type='submit' disabled={isSubmitting}>
								{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Upload & Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

interface AttachmentCrudProps {
	title: string;
	description: string;
	noun: string;
	items: IAttachment[];
	meta: IMeta;
	isLoading: boolean;
	attachmentTypes: EnumDTO[];
	onAdd: (data: FormData) => Promise<boolean>;
	onDelete: (id: string) => Promise<void>;
	onSetDefault: (item: IAttachment) => Promise<void>;
	onPageChange: (page: number) => void;
}

export function AttachmentCrud({
	title,
	description,
	noun,
	items,
	meta,
	isLoading,
	attachmentTypes,
	onAdd,
	onDelete,
	onSetDefault,
	onPageChange,
}: AttachmentCrudProps) {
	const [isFormOpen, setIsFormOpen] = useState(false);

	const handleOpenForm = () => {
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
	};

	const handleRemove = async (id: string) => {
		if (!id) return;
		await onDelete(id);
	};

	const getTypeName = (type: string) => {
		return attachmentTypes.find((t) => t.value === type)?.nameEn || type;
	};

	return (
		<div className='space-y-4'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-headline font-bold'>{title}</h1>
					<p className='text-muted-foreground'>{description}</p>
				</div>
				<Button className='w-full sm:w-auto' onClick={handleOpenForm}>
					<PlusCircle className='mr-2 h-4 w-4' />
					Add New {noun}
				</Button>
			</div>
			<Card className='glassmorphism'>
				<CardContent className='space-y-4 pt-6 relative'>
					{isLoading && items.length > 0 && (
						<div className='absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10'>
							<Loader2 className='h-8 w-8 animate-spin text-primary' />
						</div>
					)}
					<div className='space-y-2'>
						{isLoading && items.length === 0 ? (
							[...Array(3)].map((_, i) => <Skeleton key={i} className='h-24 w-full' />)
						) : items.length > 0 ? (
							items.map((item) => (
								<Card
									key={item.id}
									className='p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background/50'
								>
									<div className='flex-1 flex items-center gap-4 mb-4 sm:mb-0'>
										<FilePreviewer file={item.file}>
											<div className='bg-primary/10 text-primary p-3 rounded-lg cursor-pointer'>
												<FileText className='h-6 w-6' />
											</div>
										</FilePreviewer>
										<div>
											<FilePreviewer file={item.file}>
												<p className='font-semibold cursor-pointer hover:underline'>
													{item.file.originalFileName}
												</p>
											</FilePreviewer>
											<p className='text-sm text-muted-foreground'>{getTypeName(item.type)}</p>
											<p className='text-xs text-muted-foreground'>
												Uploaded: {format(new Date(item.createdOn), 'dd MMM, yyyy')}
											</p>
										</div>
									</div>
									<div className='flex items-center gap-4 w-full sm:w-auto justify-between'>
										<div className='flex items-center gap-2'>
											<Switch
												id={`default-switch-${item.id}`}
												checked={item.isDefault}
												onCheckedChange={() => onSetDefault(item)}
											/>
											<Label
												htmlFor={`default-switch-${item.id}`}
												className='text-sm flex items-center gap-1 cursor-pointer'
											>
												<Star
													className={`h-4 w-4 transition-colors ${
														item.isDefault ? 'text-amber-500 fill-amber-400' : 'text-muted-foreground'
													}`}
												/>
												Default
											</Label>
										</div>
										<ConfirmationDialog
											trigger={
												<Button variant='ghost' size='icon' className='h-8 w-8'>
													<Trash className='h-4 w-4 text-danger' />
												</Button>
											}
											title='Are you sure?'
											description={`This will permanently delete the attachment "${item.file.originalFileName}".`}
											onConfirm={() => handleRemove(item.id)}
											confirmText='Delete'
										/>
									</div>
								</Card>
							))
						) : (
							<p className='text-center text-sm text-muted-foreground py-4'>No attachments found.</p>
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
				<AttachmentForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={onAdd}
					attachmentTypes={attachmentTypes}
					noun={noun}
				/>
			)}
		</div>
	);
}
