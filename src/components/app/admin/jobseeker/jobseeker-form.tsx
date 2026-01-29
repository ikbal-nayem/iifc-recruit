'use client';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
import { FormMultiSelect } from '@/components/ui/form-multi-select';
import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COMMON_URL } from '@/constants/common.constant';
import useLoader from '@/hooks/use-loader';
import { toast } from '@/hooks/use-toast';
import { JobseekerSearch } from '@/interfaces/jobseeker.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { convertBnToEn } from '@/lib/translator';
import { cn, regenerateBDPhoneNumber } from '@/lib/utils';
import { UserService } from '@/services/api/user.service';
import { getOutsourcingCategoriesAsync, getPostOutsourcingByCategoryAsync } from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Check, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import * as z from 'zod';

const userSchema = z.object({
	firstName: z.string().min(1, 'First name is required.'),
	email: z.string().email('Email should be valid.').optional().or(z.literal('')),
	phone: z
		.string()
		.min(1, 'Phone number is required')
		.max(11, 'Phone number too long')
		.regex(/^01[0-9]{9}$/, 'Number must starts with 01...'),
	organizationId: z.string().optional(),
	interestedInPostIds: z.array(z.string()).optional(),
	categoryFilter: z.string().optional(),
});
type UserFormValues = z.infer<typeof userSchema>;

const bulkUserSchema = z.object({
	organizationId: z.string().optional(),
	interestedInPostIds: z.array(z.string()).optional(),
	categoryFilter: z.string().optional(),
	file: z
		.any()
		.refine((file) => file, 'File is required.')
		.refine(
			(file) =>
				[
					'application/vnd.ms-excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
					'text/csv',
				].includes(file?.type),
			'Only .xls, .xlsx, and .csv files are accepted.',
		),
});
type BulkUserFormValues = z.infer<typeof bulkUserSchema>;

const editableUserSchema = z.object({
	users: z.array(
		z.object({
			firstName: z.string().min(1, 'First name is required'),
			email: z.string().email('Invalid email').optional().or(z.literal('')),
			phone: z.string(),
			status: z.string().optional(),
		}),
	),
});
type EditableUserFormValues = z.infer<typeof editableUserSchema>;

const defaultValues: UserFormValues = {
	firstName: '',
	email: '',
	phone: '',
	organizationId: '',
	interestedInPostIds: [],
	categoryFilter: '',
};

export function JobseekerForm({
	isOpen,
	onClose,
	onSuccess,
	organizations,
	initialData,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	organizations: IClientOrganization[];
	initialData?: JobseekerSearch;
}) {
	const [activeTab, setActiveTab] = React.useState('single');
	const [isSubmitting, setIsSubmitting] = useLoader(false);
	const [step, setStep] = React.useState<'upload' | 'preview' | 'result'>('upload');
	const isEditing = !!initialData;

	const singleForm = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues,
	});

	React.useEffect(() => {
		if (isOpen && !initialData) singleForm.reset(defaultValues);
		if (isOpen && !!initialData) {
			singleForm.reset({
				firstName: initialData?.fullName || '',
				email: initialData?.email || '',
				phone: initialData?.phone || '',
				organizationId: initialData?.organizationId || '',
				interestedInPostIds: initialData?.interestedIn || [],
				categoryFilter: initialData?.outsourcingCategoryId || '',
			});
		}
	}, [isOpen, initialData]);

	const bulkForm = useForm<BulkUserFormValues>({
		resolver: zodResolver(bulkUserSchema),
		defaultValues: {
			organizationId: '',
			interestedInPostIds: [],
			categoryFilter: '',
		},
	});

	const editableForm = useForm<EditableUserFormValues>({
		resolver: zodResolver(editableUserSchema),
		defaultValues: { users: [] },
	});

	const singleCategoryFilter = singleForm.watch('categoryFilter');
	const bulkCategoryFilter = bulkForm.watch('categoryFilter');

	const { fields, replace } = useFieldArray({
		control: editableForm.control,
		name: 'users',
	});

	const handleSingleSubmit = async (data: UserFormValues) => {
		setIsSubmitting(true);
		try {
			const { categoryFilter, ...payloadData } = data;
			if (isEditing) {
				const payload = { ...payloadData, id: initialData.userId };
				await UserService.updateUser(payload);
				toast.success({
					description: 'Jobseeker updated successfully.',
				});
			} else {
				const response = await UserService.bulkCreateJobseeker([payloadData]);
				toast({
					description: response.body?.[0]?.alreadyExists
						? 'Jobseeker already exists.'
						: response.message || 'Jobseeker created successfully.',
					variant: response.body?.[0]?.alreadyExists ? 'warning' : 'success',
				});
			}
			onSuccess();
			onClose();
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to save jobseeker.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			bulkForm.setValue('file', file);
			const reader = new FileReader();
			reader.onload = (event: ProgressEvent<FileReader>) => {
				const data = new Uint8Array(event.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: 'array' });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];
				const json = XLSX.utils.sheet_to_json(worksheet, {
					header: ['name', 'mobile', 'email'],
					range: 1,
				});
				const modJson = json.map((item: any) => ({
					...item,
					firstName: item.name,
					phone: !!item.mobile ? regenerateBDPhoneNumber(convertBnToEn(String(item.mobile))) : '',
				}));
				replace(modJson as any);
				setStep('preview');
			};
			reader.readAsArrayBuffer(file);
		}
	};

	const handleBulkSubmit = async (data: EditableUserFormValues) => {
		setIsSubmitting(true);
		bulkForm.clearErrors();
		const { organizationId, interestedInPostIds } = bulkForm.getValues();
		try {
			const response = await UserService.bulkCreateJobseeker(
				data.users.map((user) => ({ organizationId, interestedInPostIds, ...user })),
			);
			const results = response.body;
			replace(results);
			setStep('result');
			toast.success({ description: 'Bulk import process completed.' });
			onSuccess();
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to import jobseekers.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetState = () => {
		singleForm.reset();
		bulkForm.reset();
		editableForm.reset();
		setStep('upload');
		onClose();
	};

	const columns = React.useMemo<ColumnDef<any>[]>(() => {
		const baseColumns: ColumnDef<any>[] = [
			{
				accessorKey: 'firstName',
				header: 'Name',
				cell: ({ row }) => (
					<FormInput
						control={editableForm.control}
						name={`users.${row.index}.firstName`}
						onFocus={(e) => e.target.select()}
						className='border-none'
					/>
				),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				cell: ({ row }) => (
					<FormInput
						control={editableForm.control}
						name={`users.${row.index}.email`}
						onFocus={(e) => e.target.select()}
						className='border-none'
					/>
				),
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				cell: ({ row }) => (
					<FormInput
						control={editableForm.control}
						name={`users.${row.index}.phone`}
						onFocus={(e) => e.target.select()}
						className='border-none'
					/>
				),
			},
		];

		if (step === 'result') {
			baseColumns.push({
				accessorKey: 'alreadyExists',
				header: 'Status',
				cell: ({ row }) => (
					<span
						className={cn(
							'flex justify-center text-xs font-semibold px-4',
							row.original.alreadyExists ? 'text-warning' : 'text-success',
						)}
					>
						{row.original.alreadyExists ? 'Exists' : <Check className='inline-block' />}
					</span>
				),
			});
		}

		return baseColumns;
	}, [editableForm.control, step]);

	const table = useReactTable({
		data: fields,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	console.log(initialData, singleForm.getValues());

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && resetState()}>
			<SheetContent className='sm:max-w-[800px] w-full p-0 flex flex-col' side='right'>
				<SheetHeader className='p-6 pb-2'>
					<SheetTitle>{isEditing ? 'Edit Jobseeker' : 'Create New Jobseeker(s)'}</SheetTitle>
					<SheetDescription>
						{isEditing
							? "Update the jobseeker's basic information."
							: 'Add a single jobseeker or upload a file for bulk import.'}
					</SheetDescription>
				</SheetHeader>
				{!isEditing && (
					<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full px-6'>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='single'>Single Entry</TabsTrigger>
							<TabsTrigger value='bulk'>Bulk Upload</TabsTrigger>
						</TabsList>
					</Tabs>
				)}
				{activeTab === 'single' || isEditing ? (
					<Form {...singleForm}>
						<form onSubmit={singleForm.handleSubmit(handleSingleSubmit)} className='space-y-4 px-6 py-4'>
							<FormAutocomplete
								control={singleForm.control}
								name='organizationId'
								label='Client Organization'
								placeholder='Select an organization'
								options={organizations}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.nameBn}
							/>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<FormInput control={singleForm.control} name='firstName' label='Name' required />
								<FormInput control={singleForm.control} name='phone' label='Phone' required />
							</div>
							<FormInput control={singleForm.control} name='email' label='Email' type='email' />
							{!isEditing && (
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<FormAutocomplete
										control={singleForm.control}
										name='categoryFilter'
										label='Posts Category'
										placeholder='Select a category'
										loadOptions={getOutsourcingCategoriesAsync}
										getOptionValue={(option) => option.id!}
										getOptionLabel={(option) => option.nameBn}
										allowClear
										onValueChange={() => singleForm.setValue('interestedInPostIds', [])}
									/>
									<FormMultiSelect
										control={singleForm.control}
										name='interestedInPostIds'
										label='Interested in (Outsourcing Post)'
										placeholder='Select posts...'
										loadOptions={(search, callback) =>
											getPostOutsourcingByCategoryAsync(search, singleCategoryFilter, callback)
										}
										getOptionValue={(option) => option.id!}
										getOptionLabel={(option) => (
											<div className='flex flex-col text-sm'>
												{option.nameBn}
												<span className='text-muted-foreground'>{option.outsourcingCategory?.nameBn}</span>
											</div>
										)}
									/>
								</div>
							)}
							<SheetFooter className='pt-4'>
								<Button type='button' variant='outline' onClick={resetState} disabled={isSubmitting}>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
									{isEditing ? 'Save Changes' : 'Create Jobseeker'}
								</Button>
							</SheetFooter>
						</form>
					</Form>
				) : (
					<div className='flex-1 flex flex-col min-h-0'>
						<div className='px-6 py-4 border-b space-y-4'>
							<Form {...bulkForm}>
								<FormAutocomplete
									control={bulkForm.control}
									name='organizationId'
									label='Client Organization'
									placeholder='Select an organization'
									options={organizations}
									getOptionValue={(option) => option.id!}
									getOptionLabel={(option) => option.nameBn}
								/>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									<FormAutocomplete
										control={bulkForm.control}
										name='categoryFilter'
										label='Posts Category'
										placeholder='Select a category'
										loadOptions={getOutsourcingCategoriesAsync}
										getOptionValue={(option) => option.id!}
										getOptionLabel={(option) => option.nameBn}
										allowClear
										onValueChange={() => bulkForm.setValue('interestedInPostIds', [])}
									/>
									<FormMultiSelect
										control={bulkForm.control}
										name='interestedInPostIds'
										label='Interested in (Outsourcing Post)'
										placeholder='Select posts to apply to all users...'
										loadOptions={(search, callback) =>
											getPostOutsourcingByCategoryAsync(search, bulkCategoryFilter, callback)
										}
										getOptionValue={(option) => option.id!}
										getOptionLabel={(option) => (
											<div className='flex flex-col text-sm'>
												{option.nameBn}
												<span className='text-muted-foreground'>{option.outsourcingCategory?.nameBn}</span>
											</div>
										)}
									/>
								</div>

								{step === 'upload' && (
									<div className='mt-4 space-y-2'>
										<FormField
											control={bulkForm.control}
											name='file'
											render={({ field }) => (
												<FormItem>
													<FormLabel required>Upload File</FormLabel>
													<FormControl>
														<Input type='file' accept='.xls, .xlsx, .csv' onChange={handleBulkFileChange} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Link href={COMMON_URL.JOBSEEKER_BULK_UPLOAD_SAMPLE} target='_top' download>
											<Button type='button' variant='link' className='p-0 h-auto mt-1'>
												<Download className='mr-2 h-4 w-4' />
												Download Sample File
											</Button>
										</Link>
									</div>
								)}
							</Form>
						</div>

						{(step === 'preview' || step === 'result') && (
							<Form {...editableForm}>
								<form
									onSubmit={editableForm.handleSubmit(handleBulkSubmit)}
									className='flex-1 flex flex-col min-h-0'
								>
									<CardHeader>
										<CardTitle>{step === 'preview' ? 'Preview and Edit' : 'Import Results'}</CardTitle>
									</CardHeader>
									<CardContent className='flex-1 overflow-auto'>
										<div className='border rounded-md'>
											<Table>
												<TableHeader>
													{table.getHeaderGroups().map((headerGroup) => (
														<TableRow key={headerGroup.id}>
															{headerGroup.headers.map((header) => (
																<TableHead key={header.id}>
																	{flexRender(header.column.columnDef.header, header.getContext())}
																</TableHead>
															))}
														</TableRow>
													))}
												</TableHeader>
												<TableBody>
													{table.getRowModel().rows.map((row) => (
														<TableRow key={row.id}>
															{row.getVisibleCells().map((cell) => (
																<TableCell key={cell.id} className='p-0'>
																	{flexRender(cell.column.columnDef.cell, cell.getContext())}
																</TableCell>
															))}
														</TableRow>
													))}
												</TableBody>
											</Table>
										</div>
									</CardContent>
									<SheetFooter className='p-3 bg-background border-t'>
										<Button type='button' variant='outline' onClick={resetState} disabled={isSubmitting}>
											Close
										</Button>
										{step === 'preview' && (
											<Button type='submit' disabled={isSubmitting}>
												{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
												Submit List
											</Button>
										)}
									</SheetFooter>
								</form>
							</Form>
						)}
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
