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
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { IMeta } from '@/interfaces/common.interface';
import { Check, Edit, Loader2, PlusCircle, Search, Trash, X } from 'lucide-react';
import { useState } from 'react';

interface MasterDataItem {
	id?: string;
	name: string;
	isActive: boolean;
}

interface MasterDataCrudProps<T extends MasterDataItem> {
	title: string;
	description: string;
	noun: string;
	items: T[];
	meta: IMeta;
	isLoading: boolean;
	onAdd: (name: string) => Promise<T | boolean | null>;
	onUpdate: (item: T) => Promise<T | boolean | null>;
	onDelete: (id: string) => Promise<boolean>;
	onToggle?: (id: string) => Promise<T | boolean | null>;
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

			// Ellipsis after first page
			if (currentPage > 2) {
				pageNumbers.push(ellipsis);
			}

			// Middle pages
			let startPage = Math.max(1, currentPage - 1);
			let endPage = Math.min(totalPages - 2, currentPage + 1);

			if (currentPage <= 2) {
				startPage = 1;
				endPage = 3;
			}
			if (currentPage >= totalPages - 3) {
				startPage = totalPages - 4;
				endPage = totalPages - 2;
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

			// Ellipsis before last page
			if (currentPage < totalPages - 3) {
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
			<Button variant='outline' size='sm' onClick={() => onPageChange(meta.page - 1)} disabled={!meta.prevPage || isLoading}>
				Previous
			</Button>
			<div className='hidden md:flex items-center gap-1'>{renderPageNumbers()}</div>
			<Button variant='outline' size='sm' onClick={() => onPageChange(meta.page + 1)} disabled={!meta.nextPage || isLoading}>
				Next
			</Button>
		</div>
	);
};

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
	onToggle,
	onPageChange,
	onSearch,
}: MasterDataCrudProps<T>) {
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editingValue, setEditingValue] = useState('');
	const [newValue, setNewValue] = useState('');
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

	const [isAdding, setIsAdding] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

	const handleAddNew = async () => {
		if (newValue.trim() === '') return;
		setIsAdding(true);
		const success = await onAdd(newValue.trim());
		if (success) {
			setNewValue('');
			setIsAddDialogOpen(false);
		}
		setIsAdding(false);
	};

	const handleUpdate = async (index: number) => {
		if (editingValue.trim() === '') return;

		const item = items[index];
		if (!item.id) return;

		setIsSubmitting(item.id);
		const success = await onUpdate({ ...item, name: editingValue.trim() });
		if (success) {
			setEditingIndex(null);
			setEditingValue('');
		}
		setIsSubmitting(null);
	};

	const handleToggleActive = async (item: T) => {
		if (!item.id) return;

		setIsSubmitting(item.id);
		await onUpdate({ ...item, isActive: !item.isActive });
		setIsSubmitting(null);
	};

	const handleRemove = async (id?: string) => {
		if (!id) return;
		await onDelete(id);
	};

	const startEditing = (index: number, value: string) => {
		setEditingIndex(index);
		setEditingValue(value);
	};

	const cancelEditing = () => {
		setEditingIndex(null);
		setEditingValue('');
	};

	const from = meta.totalRecords ? meta.page * meta.limit + 1 : 0;
	const to = Math.min((meta.page + 1) * meta.limit, meta.totalRecords || 0);

	return (
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
					<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
						<DialogTrigger asChild>
							<Button className='w-full sm:w-auto'>
								<PlusCircle className='mr-2 h-4 w-4' />
								Add New {noun}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add New {noun}</DialogTitle>
								<DialogDescription>Enter the name for the new {noun.toLowerCase()}.</DialogDescription>
							</DialogHeader>
							<div className='grid gap-4 py-4'>
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor='new-item-name' className='text-right'>
										Name
									</Label>
									<Input
										id='new-item-name'
										value={newValue}
										onChange={(e) => setNewValue(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
										className='col-span-3'
										autoFocus
										required
										disabled={isAdding}
									/>
								</div>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button type='button' variant='ghost' disabled={isAdding}>
										Cancel
									</Button>
								</DialogClose>
								<Button type='button' onClick={handleAddNew} disabled={isAdding}>
									{isAdding ? (
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									) : (
										<PlusCircle className='mr-2 h-4 w-4' />
									)}
									Add
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className='space-y-2'>
					{isLoading
						? [...Array(5)].map((_, i) => <Skeleton key={i} className='h-12 w-full' />)
						: items.map((item, index) => (
								<AlertDialog key={item.id}>
									<div className='flex items-center justify-between p-2 rounded-md border bg-background/50'>
										{editingIndex === index ? (
											<Input
												value={editingValue}
												onChange={(e) => setEditingValue(e.target.value)}
												onKeyDown={(e) => e.key === 'Enter' && handleUpdate(index)}
												className='h-8'
												autoFocus
												disabled={isSubmitting === item.id}
											/>
										) : (
											<div className='flex items-center gap-4'>
												<Switch
													id={`active-switch-${item.id}`}
													checked={item.isActive}
													onCheckedChange={() => handleToggleActive(item)}
													disabled={isSubmitting === item.id}
												/>
												<p className={`text-sm ${!item.isActive && 'text-muted-foreground line-through'}`}>
													{item.name}
												</p>
											</div>
										)}
										<div className='flex gap-1'>
											{editingIndex === index ? (
												<>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8'
														onClick={() => handleUpdate(index)}
														disabled={isSubmitting === item.id}
													>
														{isSubmitting === item.id ? (
															<Loader2 className='h-4 w-4 animate-spin' />
														) : (
															<Check className='h-4 w-4 text-green-600' />
														)}
													</Button>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8'
														onClick={cancelEditing}
														disabled={isSubmitting === item.id}
													>
														<X className='h-4 w-4 text-destructive' />
													</Button>
												</>
											) : (
												<>
													<Button
														variant='ghost'
														size='icon'
														className='h-8 w-8'
														onClick={() => startEditing(index, item.name)}
													>
														<Edit className='h-4 w-4' />
													</Button>
													<AlertDialogTrigger asChild>
														<Button variant='ghost' size='icon' className='h-8 w-8'>
															<Trash className='h-4 w-4 text-destructive' />
														</Button>
													</AlertDialogTrigger>
												</>
											)}
										</div>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be undone. This will permanently delete the {noun.toLowerCase()}{' '}
													<strong>&quot;{item.name}&quot;</strong>.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleRemove(item?.id)}
													className='bg-destructive hover:bg-destructive/90'
												>
													Continue
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</div>
								</AlertDialog>
						  ))}
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
	);
}
