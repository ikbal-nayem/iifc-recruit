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
import { toast } from '@/hooks/use-toast';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { UserService } from '@/services/api/user.service';
import { getPostOutsourcingAsync } from '@/services/async-api';
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
	lastName: z.string().min(1, 'Last name is required.'),
	email: z.string().email('Email should be valid.'),
	phone: z.string().optional(),
	organizationId: z.string().min(1, 'Organization is required.'),
	interestedInPostIds: z.array(z.string()).optional(),
});
type UserFormValues = z.infer<typeof userSchema>;

const bulkUserSchema = z.object({
	organizationId: z.string().min(1, 'Organization is required.'),
	interestedInPostIds: z.array(z.string()).optional(),
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
			'Only .xls, .xlsx, and .csv files are accepted.'
		),
});
type BulkUserFormValues = z.infer<typeof bulkUserSchema>;

const editableUserSchema = z.object({
	users: z.array(
		z.object({
			firstName: z.string().min(1, 'First name is required'),
			lastName: z.string().min(1, 'Last name is required'),
			email: z.string().email('Invalid email'),
			phone: z.string().optional(),
			status: z.string().optional(),
		})
	),
});
type EditableUserFormValues = z.infer<typeof editableUserSchema>;

export function JobseekerForm({
	isOpen,
	onClose,
	onSuccess,
	organizations,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	organizations: IClientOrganization[];
}) {
	const [activeTab, setActiveTab] = React.useState('single');
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [step, setStep] = React.useState<'upload' | 'preview' | 'result'>('upload');

	const singleForm = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			organizationId: '',
			interestedInPostIds: [],
		},
	});

	const bulkForm = useForm<BulkUserFormValues>({
		resolver: zodResolver(bulkUserSchema),
		defaultValues: {
			organizationId: '',
			interestedInPostIds: [],
		},
	});

	const editableForm = useForm<EditableUserFormValues>({
		resolver: zodResolver(editableUserSchema),
		defaultValues: { users: [] },
	});

	const { fields, replace } = useFieldArray({
		control: editableForm.control,
		name: 'users',
	});

	const handleSingleSubmit = async (data: UserFormValues) => {
		setIsSubmitting(true);
		try {
			const { organizationId, interestedInPostIds, ...userData } = data;
			const response = await UserService.bulkCreateJobseeker([
				{ organizationId, interestedInPostIds, ...userData },
			]);
			toast.success({ description: response.message || 'Jobseeker created successfully.' });
			onSuccess();
			onClose();
		} catch (error: any) {
			toast.error({
				description: error.message || 'Failed to create jobseeker.',
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
					header: ['firstName', 'lastName', 'email', 'phone'],
					range: 1,
				});
				const modJson = json.map((item: any) => ({
					...item,
					phone: item.phone ? String(item.phone) : '',
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
		if (!organizationId) {
			bulkForm.setError('organizationId', { message: 'Select an organization.', type: 'required' });
			toast.error({
				description: 'Please select a client organization.',
			});
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await UserService.bulkCreateJobseeker(
				data.users.map((user) => ({ organizationId, interestedInPostIds, ...user }))
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
				header: 'First Name',
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
				accessorKey: 'lastName',
				header: 'Last Name',
				cell: ({ row }) => (
					<FormInput
						control={editableForm.control}
						name={`users.${row.index}.lastName`}
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
							row.original.alreadyExists ? 'text-warning' : 'text-success'
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

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && resetState()}>
			<SheetContent className='sm:max-w-[800px] w-full p-0 flex flex-col' side='right'>
				<SheetHeader className='p-6 pb-2'>
					<SheetTitle>Create New Jobseeker(s)</SheetTitle>
					<SheetDescription>Add a single jobseeker or upload a file for bulk import.</SheetDescription>
				</SheetHeader>
				<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full px-6'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='single'>Single Entry</TabsTrigger>
						<TabsTrigger value='bulk'>Bulk Upload</TabsTrigger>
					</TabsList>
				</Tabs>
				{activeTab === 'single' ? (
					<Form {...singleForm}>
						<form onSubmit={singleForm.handleSubmit(handleSingleSubmit)} className='space-y-4 px-6 py-4'>
							<FormAutocomplete
								control={singleForm.control}
								name='organizationId'
								label='Client Organization'
								required
								placeholder='Select an organization'
								options={organizations}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.nameBn}
							/>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<FormInput control={singleForm.control} name='firstName' label='First Name' required />
								<FormInput control={singleForm.control} name='lastName' label='Last Name' required />
							</div>
							<FormInput control={singleForm.control} name='email' label='Email' type='email' required />
							<FormInput control={singleForm.control} name='phone' label='Phone' />
							<FormMultiSelect
								control={singleForm.control}
								name='interestedInPostIds'
								label='Interested in (Outsourcing)'
								placeholder='Select posts...'
								loadOptions={getPostOutsourcingAsync}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => (
									<div className='flex flex-col text-sm'>
										{option.nameBn}
										<span className='text-xs text-muted-foreground'>
											{option.outsourcingCategory?.nameBn}
										</span>
									</div>
								)}
							/>
							<SheetFooter className='pt-4'>
								<Button type='button' variant='outline' onClick={resetState} disabled={isSubmitting}>
									Cancel
								</Button>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
									Create Jobseeker
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
									required
									placeholder='Select an organization'
									options={organizations}
									getOptionValue={(option) => option.id!}
									getOptionLabel={(option) => option.nameBn}
									onValueChange={() => bulkForm.clearErrors()}
								/>
								<FormMultiSelect
									control={bulkForm.control}
									name='interestedInPostIds'
									label='Interested in (Outsourcing)'
									placeholder='Select posts to apply to all users...'
									loadOptions={getPostOutsourcingAsync}
									getOptionValue={(option) => option.id!}
									getOptionLabel={(option) => (
										<div className='flex flex-col text-sm'>
											{option.nameBn}
											<span className='text-xs text-muted-foreground'>
												{option.outsourcingCategory?.nameBn}
											</span>
										</div>
									)}
								/>

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
										<Link href='/files/jobseeker-bulk-upload-sample.xlsx' target='_top' download>
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
