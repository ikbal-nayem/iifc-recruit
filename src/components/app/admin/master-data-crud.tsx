
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
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { IMeta } from '@/interfaces/common.interface';
import { Check, Edit, Loader2, PlusCircle, Search, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface MasterDataItem {
	id: number;
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
	onAdd: (name: string) => Promise<T | null>;
	onUpdate: (id: number, name: string) => Promise<T | null>;
	onDelete: (id: number) => Promise<boolean>;
	onToggle: (id: number) => Promise<T | null>;
	onPageChange: (page: number) => void;
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
	onToggle,
	onPageChange,
	onSearch,
}: MasterDataCrudProps<T>) {
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [editingValue, setEditingValue] = useState('');
	const [newValue, setNewValue] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

	const [isAdding, setIsAdding] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

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
		setIsSubmitting(item.id);
		const success = await onUpdate(item.id, editingValue.trim());
		if (success) {
			setEditingIndex(null);
			setEditingValue('');
		}
		setIsSubmitting(null);
	};

	const handleToggleActive = async (id: number) => {
		await onToggle(id);
	};

	const handleRemove = async (id: number) => {
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
                                <DialogDescription>
                                    Enter the name for the new {noun.toLowerCase()}.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="new-item-name" className="text-right">
                                        Name
                                    </Label>
                                    <Input 
                                        id="new-item-name" 
                                        value={newValue} 
                                        onChange={(e) => setNewValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
                                        className="col-span-3" 
                                        autoFocus
                                        disabled={isAdding}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="ghost" disabled={isAdding}>Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleAddNew} disabled={isAdding}>
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
													onCheckedChange={() => handleToggleActive(item.id)}
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
													&quot;{item.name}&quot;.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleRemove(item.id)}
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
			{meta && meta.totalRecords && meta.totalRecords > meta.limit && (
				<CardFooter className='justify-end space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => onPageChange(meta.page - 1)}
						disabled={!meta.prevPage || isLoading}
					>
						Previous
					</Button>
					<span className='text-sm text-muted-foreground'>
						Page {meta.page} of {meta.totalPageCount}
					</span>
					<Button
						variant='outline'
						size='sm'
						onClick={() => onPageChange(meta.page + 1)}
						disabled={!meta.nextPage || isLoading}
					>
						Next
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
