
'use client';

import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
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
import { useToast } from '@/hooks/use-toast';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { UserService } from '@/services/api/user.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Download, FileText, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import * as z from 'zod';

const userSchema = z.object({
	firstName: z.string().min(1, 'First name is required.'),
	lastName: z.string().min(1, 'Last name is required.'),
	email: z.string().email('Email should be valid.'),
	phone: z.string().optional(),
	clientOrganizationId: z.string().min(1, 'Client Organization is required.'),
});
type UserFormValues = z.infer<typeof userSchema>;

const bulkUserSchema = z.object({
	clientOrganizationId: z.string().min(1, 'Client Organization is required.'),
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
	const { toast } = useToast();
	const [activeTab, setActiveTab] = React.useState('single');
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [setPreviewData] = React.useState<any[]>([]);
	const [step, setStep] = React.useState<'upload' | 'preview' | 'result'>('upload');

	const singleForm = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: { firstName: '', lastName: '', email: '', phone: '', clientOrganizationId: '' },
	});

	const bulkForm = useForm<BulkUserFormValues>({
		resolver: zodResolver(bulkUserSchema),
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
			const { clientOrganizationId, ...userData } = data;
			await UserService.bulkCreateJobseeker({
				clientOrganizationId,
				users: [userData],
			});
			toast({ title: 'Success', description: 'Jobseeker created successfully.' });
			onSuccess();
			onClose();
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'Failed to create jobseeker.', variant: 'danger' });
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
					range: 1, // Skip header row
				});
				setPreviewData(json);
				replace(json as any);
				setStep('preview');
			};
			reader.readAsArrayBuffer(file);
		}
	};

	const handleBulkSubmit = async (data: EditableUserFormValues) => {
		setIsSubmitting(true);
		const clientOrganizationId = bulkForm.getValues('clientOrganizationId');
		if (!clientOrganizationId) {
			toast({
				title: 'Error',
				description: 'Please select a client organization.',
				variant: 'danger',
			});
			setIsSubmitting(false);
			return;
		}

		try {
			const response = await UserService.bulkCreateJobseeker({
				clientOrganizationId,
				users: data.users,
			});
			// Assuming API returns a status for each user
			const results = response.body;
			replace(results);
			setStep('result');
			toast({ title: 'Success', description: 'Bulk import process completed.' });
			onSuccess();
		} catch (error: any) {
			toast({ title: 'Error', description: error.message || 'Failed to import jobseekers.', variant: 'danger' });
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetState = () => {
		singleForm.reset();
		bulkForm.reset();
		editableForm.reset();
		setPreviewData([]);
		setStep('upload');
		onClose();
	};

	const getTableColumns = (): ColumnDef<any>[] => {
		const baseColumns: ColumnDef<any>[] = [
			{
				accessorKey: 'firstName',
				header: 'First Name',
				cell: ({ row }) => (
					<FormInput
						control={editableForm.control}
						name={`users.${row.index}.firstName`}
						className='border-none'
					/>
				),
			},
			{
				accessorKey: 'lastName',
				header: 'Last Name',
				cell: ({ row }) => (
					<FormInput control={editableForm.control} name={`users.${row.index}.lastName`} className='border-none' />
				),
			},
			{
				accessorKey: 'email',
				header: 'Email',
				cell: ({ row }) => (
					<FormInput control={editableForm.control} name={`users.${row.index}.email`} className='border-none' />
				),
			},
			{
				accessorKey: 'phone',
				header: 'Phone',
				cell: ({ row }) => (
					<FormInput control={editableForm.control} name={`users.${row.index}.phone`} className='border-none' />
				),
			},
		];

		if (step === 'result') {
			baseColumns.push({
				accessorKey: 'status',
				header: 'Status',
				cell: ({ row }) => (
					<span
						className={cn(
							'text-xs font-semibold',
							row.original.status === 'Created'
								? 'text-success'
								: row.original.status === 'Exists'
								? 'text-warning'
								: 'text-danger'
						)}
					>
						{row.original.status}
					</span>
				),
			});
		}

		return baseColumns;
	};

	const table = useReactTable({
		data: fields,
		columns: getTableColumns(),
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
								name='clientOrganizationId'
								label='Client Organization'
								required
								placeholder='Select an organization'
								options={organizations}
								getOptionValue={(option) => option.id!}
								getOptionLabel={(option) => option.nameEn}
							/>
							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<FormInput control={singleForm.control} name='firstName' label='First Name' required />
								<FormInput control={singleForm.control} name='lastName' label='Last Name' required />
							</div>
							<FormInput control={singleForm.control} name='email' label='Email' type='email' required />
							<FormInput control={singleForm.control} name='phone' label='Phone' />
							<SheetFooter className='pt-4'>
								<Button type='button' variant='ghost' onClick={resetState} disabled={isSubmitting}>
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
						<Form {...bulkForm}>
							<form
								onChange={() => {}}
								className='px-6 py-4 border-b'
								hidden={step !== 'upload'}
							>
								<div className='space-y-4'>
									<FormAutocomplete
										control={bulkForm.control}
										name='clientOrganizationId'
										label='Client Organization'
										required
										placeholder='Select an organization'
										options={organizations}
										getOptionValue={(option) => option.id!}
										getOptionLabel={(option) => option.nameEn}
									/>
									<FormField
										control={bulkForm.control}
										name='file'
										render={({ field }) => (
											<FormItem>
												<FormLabel required>Upload File</FormLabel>
												<FormControl>
													<Input
														type='file'
														accept='.xls, .xlsx, .csv'
														onChange={handleBulkFileChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button type='button' variant='link' className='p-0 h-auto'>
										<Download className='mr-2 h-4 w-4' />
										Download Sample File
									</Button>
								</div>
							</form>
						</Form>
						{(step === 'preview' || step === 'result') && (
							<Form {...editableForm}>
								<form
									onSubmit={editableForm.handleSubmit(handleBulkSubmit)}
									className='flex-1 flex flex-col min-h-0'
								>
									<CardHeader>
										<CardTitle>Preview and Edit</CardTitle>
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
									<SheetFooter className='p-6 bg-white border-t'>
										<Button type='button' variant='ghost' onClick={resetState} disabled={isSubmitting}>
											Cancel
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
