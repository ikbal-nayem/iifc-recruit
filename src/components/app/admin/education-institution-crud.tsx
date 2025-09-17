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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Edit, Loader2, PlusCircle, Search, Trash, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface InstitutionItem {
	name: string;
	country: string;
	isActive: boolean;
}

interface EducationInstitutionCrudProps {
	title: string;
	description: string;
	initialData: InstitutionItem[];
	noun: string;
}

export function EducationInstitutionCrud({ title, description, initialData, noun }: EducationInstitutionCrudProps) {
	const { toast } = useToast();
	const [data, setData] = useState<InstitutionItem[]>(initialData);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const initialNewState: InstitutionItem = { name: '', country: '', isActive: true };
	const [newItem, setNewItem] = useState<InstitutionItem>(initialNewState);
	const [editingItem, setEditingItem] = useState<InstitutionItem | null>(null);

	const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const [countries, setCountries] = useState<ICommonMasterData[]>([]);
	const [countryPopoverOpen, setCountryPopoverOpen] = useState(false);

	useEffect(() => {
		async function fetchCountries() {
			try {
				const response = await MasterDataService.country.getList({ meta: { limit: 200 } });
				setCountries(response.body);
			} catch (error) {
				console.error('Failed to fetch countries', error);
				toast({
					title: 'Error',
					description: 'Failed to load countries.',
					variant: 'destructive',
				});
			}
		}
		fetchCountries();
	}, [toast]);

	const handleAddNew = async () => {
		if (newItem.name.trim() === '' || newItem.country.trim() === '') {
			toast({ title: 'Error', description: `Institution name and country cannot be empty.`, variant: 'destructive' });
			return;
		}
		if (data.some((item) => item.name.toLowerCase() === newItem.name.trim().toLowerCase())) {
			toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive' });
			return;
		}
		setIsAdding(true);
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		const itemToAdd: InstitutionItem = { ...newItem, name: newItem.name.trim() };
		setData([...data, itemToAdd]);
		setNewItem(initialNewState);
		toast({ title: 'Success', description: `${noun} added successfully.`, variant: 'success' });
		setIsAdding(false);
		setIsAddDialogOpen(false);
	};

	const handleUpdate = async (index: number) => {
		if (!editingItem || editingItem.name.trim() === '' || editingItem.country.trim() === '') {
			toast({ title: 'Error', description: `Institution name and country are required.`, variant: 'destructive' });
			return;
		}
		if (data.some((item, i) => i !== index && item.name.toLowerCase() === editingItem.name.trim().toLowerCase())) {
			toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive' });
			return;
		}
		setIsSubmitting(index);
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		const updatedData = [...data];
		updatedData[index] = { ...editingItem, name: editingItem.name.trim() };
		setData(updatedData);
		setEditingIndex(null);
		setIsSubmitting(null);
	};

	const handleToggleActive = async (index: number) => {
		const item = data[index];
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		const updatedItem = { ...item, isActive: !item.isActive };
		const updatedData = [...data];
		updatedData[index] = updatedItem;
		setData(updatedData);
		toast({ title: 'Status Updated', description: `${updatedItem.name}'s status has been changed.`, variant: 'success' });
	};

	const handleRemove = async (index: number) => {
		// Mock API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		setData(data.filter((_, i) => i !== index));
		toast({ title: 'Success', description: `${noun} removed successfully.`, variant: 'success' });
	};

	const startEditing = (index: number, item: InstitutionItem) => {
		setEditingIndex(index);
		setEditingItem({ ...item });
	};

	const cancelEditing = () => {
		setEditingIndex(null);
		setEditingItem(null);
	};

	const filteredData = data.filter(
		(item) =>
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.country.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const CountryCombobox = ({
		value,
		onChange,
		disabled,
	}: {
		value: string;
		onChange: (value: string) => void;
		disabled?: boolean;
	}) => {
		const [open, setOpen] = useState(false);
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className='w-full justify-between'
						disabled={disabled}
					>
						{value ? countries.find((c) => c.name.toLowerCase() === value.toLowerCase())?.name : 'Select Country'}
						<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
					<Command>
						<CommandInput placeholder='Search country...' />
						<CommandList>
							<CommandEmpty>No country found.</CommandEmpty>
							<CommandGroup>
								{countries.map((c) => (
									<CommandItem
										key={c.id}
										value={c.name}
										onSelect={(currentValue) => {
											onChange(currentValue.toLowerCase() === value.toLowerCase() ? '' : currentValue);
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												value.toLowerCase() === c.name.toLowerCase() ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{c.name}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	};

	const renderViewItem = (item: InstitutionItem, index: number) => (
		<Card key={index} className='p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background/50'>
			<div className='flex-1 mb-4 sm:mb-0'>
				<p className={`font-semibold ${!item.isActive && 'text-muted-foreground line-through'}`}>{item.name}</p>
				<p className='text-sm text-muted-foreground'>{item.country}</p>
			</div>
			<div className='flex items-center gap-2 w-full sm:w-auto justify-between'>
				<div className='flex items-center gap-2'>
					<Switch checked={item.isActive} onCheckedChange={() => handleToggleActive(index)} />
					<Label htmlFor={`active-switch-${index}`} className='text-sm'>
						{item.isActive ? 'Active' : 'Inactive'}
					</Label>
				</div>
				<div className='flex'>
					<Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => startEditing(index, item)}>
						<Edit className='h-4 w-4' />
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant='ghost' size='icon' className='h-8 w-8'>
								<Trash className='h-4 w-4 text-destructive' />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This will permanently delete the {noun.toLowerCase()} &quot;{item.name}&quot;.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => handleRemove(index)} className='bg-destructive hover:bg-destructive/90'>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</Card>
	);

	const renderEditItem = (index: number) => (
		<div key={index} className='p-4 rounded-md border bg-muted/90 space-y-4'>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
				<Input
					placeholder='Name'
					value={editingItem?.name}
					onChange={(e) => setEditingItem({ ...editingItem!, name: e.target.value })}
					autoFocus
				/>
				<CountryCombobox
					value={editingItem?.country || ''}
					onChange={(value) => setEditingItem({ ...editingItem!, country: value })}
				/>
			</div>
			<div className='flex justify-end gap-2'>
				<Button variant='ghost' size='sm' onClick={cancelEditing} disabled={isSubmitting === index}>
					Cancel
				</Button>
				<Button size='sm' onClick={() => handleUpdate(index)} disabled={isSubmitting === index}>
					{isSubmitting === index ? (
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					) : (
						<Check className='mr-2 h-4 w-4' />
					)}
					Save
				</Button>
			</div>
		</div>
	);

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
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
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
								<DialogDescription>Enter the details for the new {noun.toLowerCase()}.</DialogDescription>
							</DialogHeader>
							<div className='grid gap-4 py-4'>
								<div className='space-y-2'>
									<Label htmlFor='new-item-name'>Name</Label>
									<Input
										id='new-item-name'
										value={newItem.name}
										onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
										autoFocus
										disabled={isAdding}
									/>
								</div>
								<div className='space-y-2'>
									<Label>Country</Label>
									<CountryCombobox
										value={newItem.country}
										onChange={(value) => setNewItem({ ...newItem, country: value })}
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
				<div className='space-y-2 pt-4'>
					{filteredData.map((item, index) =>
						editingIndex === data.indexOf(item) ? renderEditItem(data.indexOf(item)) : renderViewItem(item, data.indexOf(item))
					)}
					{filteredData.length === 0 && (
						<p className='text-center text-sm text-muted-foreground py-4'>No {noun.toLowerCase()}s found.</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
