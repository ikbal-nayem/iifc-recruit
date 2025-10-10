
'use client';

import { FormMasterData } from '@/app/(auth)/admin/client-organizations/page';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormCheckbox } from '@/components/ui/form-checkbox';
import { FormInput } from '@/components/ui/form-input';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { isBangla, isEnglish } from '@/lib/utils';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Edit,
	Globe,
	Loader2,
	Mail,
	Phone,
	PlusCircle,
	Search,
	Trash,
	UserPlus,
	View,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { ActionItem, ActionMenu } from '@/components/ui/action-menu';

const formSchema = z
	.object({
		nameEn: z.string().min(1, 'English name is required.').refine(isEnglish, {
			message: 'Only English characters, numbers, and some special characters are allowed.',
		}),
		nameBn: z.string().min(1, 'Bengali name is required.').refine(isBangla, {
			message: 'Only Bengali characters, numbers, and some special characters are allowed.',
		}),
		organizationTypeId: z.coerce.number().min(1, 'Organization Type is required.'),
		address: z.string().optional(),
		contactPersonName: z.string().optional(),
		contactNumber: z.string().optional(),
		email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
		website: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
		isClient: z.boolean().default(false),
		isExaminer: z.boolean().default(false),
	})
	.refine((data) => data.isClient || data.isExaminer, {
		message: 'At least one role (Client or Examiner) must be selected.',
		path: ['isClient'], // You can assign the error to one of the fields
	});

type FormValues = z.infer<typeof formSchema>;

interface ClientOrganizationFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: FormValues) => Promise<boolean>;
	initialData?: IClientOrganization;
	noun: string;
	masterData: FormMasterData;
}

function ClientOrganizationForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	noun,
	masterData: { organizationTypes },
}: ClientOrganizationFormProps) {
	const defaultValues = initialData
		? { ...initialData }
		: {
				nameEn: '',
				nameBn: '',
				organizationTypeId: undefined,
				address: '',
				contactPersonName: '',
				contactNumber: '',
				email: '',
				website: '',
				isClient: false,
				isExaminer: false,
		  };

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFormSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		const success = await onSubmit(data);
		if (success) {
			onClose();
		}
		setIsSubmitting(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
				<DialogHeader>
					<DialogTitle>{initialData ? `Edit ${noun}` : `Add ${noun}`}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-4 py-4' noValidate>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='nameEn'
								label='Name (English)'
								placeholder='Client Name'
								required
								disabled={isSubmitting}
							/>
							<FormInput
								control={form.control}
								name='nameBn'
								label='Name (Bangla)'
								placeholder='ক্লায়েন্টের নাম'
								required
								disabled={isSubmitting}
							/>
						</div>
						<FormAutocomplete
							control={form.control}
							name='organizationTypeId'
							label='Organization Type'
							required
							placeholder='Select Organization Type'
							options={organizationTypes}
							getOptionValue={(option) => option.id!}
							getOptionLabel={(option) => option.nameEn}
							disabled={isSubmitting}
						/>
						<div className='flex gap-4'>
							<FormCheckbox control={form.control} name='isClient' label='Is Client' />
							<FormCheckbox control={form.control} name='isExaminer' label='Is Examiner' />
						</div>
						<FormInput
							control={form.control}
							name='address'
							label='Address'
							placeholder='Address'
							disabled={isSubmitting}
						/>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='contactPersonName'
								label='Contact Person'
								placeholder='Name'
								disabled={isSubmitting}
							/>
							<FormInput
								control={form.control}
								name='contactNumber'
								label='Contact Number'
								placeholder='Phone number'
								disabled={isSubmitting}
								startIcon={<Phone className='h-4 w-4 text-muted-foreground' />}
							/>
						</div>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='email'
								label='Email'
								type='email'
								placeholder='Contact email'
								disabled={isSubmitting}
								startIcon={<Mail className='h-4 w-4 text-muted-foreground' />}
							/>
							<FormInput
								control={form.control}
								name='website'
								label='Website'
								type='url'
								placeholder='https://example.com'
								disabled={isSubmitting}
								startIcon={<Globe className='h-4 w-4 text-muted-foreground' />}
							/>
						</div>

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

const initMeta: IMeta = { page: 0, limit: 20 };

interface ClientOrganizationCrudProps {
	title: string;
	description: string;
	noun: string;
	masterData: FormMasterData;
}

export function ClientOrganizationCrud({ title, description, noun, masterData }: ClientOrganizationCrudProps) {
	const { toast } = useToast();
	const [items, setItems] = useState<IClientOrganization[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);

	const [isLoading, setIsLoading] = useState(true);

	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<IClientOrganization | undefined>(undefined);

	const loadItems = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { nameEn: search },
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.clientOrganization.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					description: 'Failed to load client organizations.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		loadItems(0, debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const handleOpenForm = (item?: IClientOrganization) => {
		setEditingItem(item);
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setEditingItem(undefined);
	};

	const handleFormSubmit = async (data: FormValues): Promise<boolean> => {
		const payload = { ...editingItem, ...data, active: editingItem?.active ?? true };
		try {
			const response = editingItem?.id
				? await MasterDataService.clientOrganization.update(payload)
				: await MasterDataService.clientOrganization.add({ ...payload, active: true });

			toast({ description: response.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error: any) {
			console.error('Failed to save item', error);
			toast({ title: 'Error', description: error.message || `Failed to save ${noun}.`, variant: 'danger' });
			return false;
		}
	};

	const handleDelete = async (id: number) => {
		try {
			await MasterDataService.clientOrganization.delete(id.toString());
			toast({ title: 'Success', description: 'Client organization deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch);
		} catch (error: any) {
			console.error('Failed to delete item', error);
			toast({
				title: 'Error',
				description: error?.message || 'Failed to delete client organization.',
				variant: 'danger',
			});
		}
	};

	const getActionItems = (item: IClientOrganization): ActionItem[] => [
		{
			label: 'View Details',
			icon: <View className='mr-2 h-4 w-4' />,
			href: `/admin/client-organizations/${item.id}`,
		},
		{
			label: 'Create User',
			icon: <UserPlus className='mr-2 h-4 w-4' />,
			onClick: () => toast({ description: 'User creation (not implemented).' }),
		},
		{ isSeparator: true },
		{
			label: 'Edit',
			icon: <Edit className='mr-2 h-4 w-4' />,
			onClick: () => handleOpenForm(item),
		},
		{
			label: 'Delete',
			icon: <Trash className='mr-2 h-4 w-4' />,
			variant: 'danger',
			onClick: () => {
				const dialog = document.createElement('div');
				document.body.appendChild(dialog);
				const root = require('react-dom/client').createRoot(dialog);
				root.render(
					React.createElement(ConfirmationDialog, {
						trigger: <></>, // The trigger is handled manually
						open: true,
						onOpenChange: (open) => !open && root.unmount(),
						title: 'Are you sure?',
						description: `This will permanently delete the organization "${item.nameEn}".`,
						onConfirm: () => {
							handleDelete(item.id!);
							root.unmount();
						},
						confirmText: 'Delete',
					})
				);
			},
		},
	];

	const columns: ColumnDef<IClientOrganization>[] = [
		{
			accessorKey: 'nameEn',
			header: 'Organization Name',
			cell: ({ row }) => {
				const item = row.original;
				return (
					<div className='flex items-center gap-3'>
						<Avatar className='h-9 w-9'>
							<AvatarFallback>{item.nameEn.charAt(0)}</AvatarFallback>
						</Avatar>
						<div>
							<div className='font-medium'>{item.nameEn}</div>
							<div className='text-sm text-muted-foreground'>{item.nameBn}</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: 'organizationType.nameEn',
			header: 'Type',
		},
		{
			header: 'Roles',
			cell: ({ row }) => {
				const item = row.original;
				return (
					<div className='flex gap-2'>
						{item.isClient && <Badge variant='secondary'>Client</Badge>}
						{item.isExaminer && <Badge variant='secondary'>Examiner</Badge>}
					</div>
				);
			},
		},
		{
			accessorKey: 'contactPersonName',
			header: 'Contact Person',
			cell: ({ row }) => {
				const item = row.original;
				return (
					<div>
						<div>{item.contactPersonName}</div>
						<div className='text-sm text-muted-foreground'>{item.contactNumber}</div>
					</div>
				);
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const item = row.original;
				return <ActionMenu label='Actions' items={getActionItems(item)} />;
			},
		},
	];

	const table = useReactTable({
		data: items,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: meta.totalPageCount,
	});

	return (
		<div className='space-y-8'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-headline font-bold'>{title}</h1>
					<p className='text-muted-foreground'>{description}</p>
				</div>
				<Button className='w-full sm:w-auto' onClick={() => handleOpenForm()}>
					<PlusCircle className='mr-2 h-4 w-4' />
					Add {noun}
				</Button>
			</div>
			<Card className='glassmorphism'>
				<CardContent className='pt-6'>
					<div className='relative w-full lg:max-w-xs'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder={`Search ${noun.toLowerCase()}s...`}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10'
						/>
					</div>
					<div className='mt-4 rounded-md border'>
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</TableHead>
											);
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{isLoading ? (
									[...Array(meta.limit)].map((_, i) => (
										<TableRow key={i}>
											<TableCell colSpan={columns.length}>
												<Skeleton className='h-10 w-full' />
											</TableCell>
										</TableRow>
									))
								) : table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columns.length} className='h-24 text-center'>
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
				{meta && meta.totalRecords && meta.totalRecords > 0 ? (
					<CardFooter>
						<Pagination meta={meta} isLoading={isLoading} onPageChange={handlePageChange} noun={noun} />
					</CardFooter>
				) : null}
			</Card>
			{isFormOpen && (
				<ClientOrganizationForm
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSubmit={handleFormSubmit}
					initialData={editingItem}
					noun={noun}
					masterData={masterData}
				/>
			)}
		</div>
	);
}
