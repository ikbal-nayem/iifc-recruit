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
import { Select, SelectContent, Sbox, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { countries } from '@/lib/countries';
import { Check, Edit, Loader2, PlusCircle, Search, Trash, X } from 'lucide-react';
import React, { useState } from 'react';

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

	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isAdding, setIsAdding] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

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
				<Select value={editingItem?.country} onValueChange={(value) => setEditingItem({ ...editingItem!, country: value })}>
					<SelectTrigger>
						<SelectValue placeholder='Select Country' />
					</SelectTrigger>
					<SelectContent>
						{countries.map((c) => (
							<SelectItem key={c.code} value={c.name}>
								{c.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
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
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor='new-item-name' className='text-right'>
										Name
									</Label>
									<Input
										id='new-item-name'
										value={newItem.name}
										onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
										className='col-span-3'
										autoFocus
										disabled={isAdding}
									/>
								</div>
								<div className='grid grid-cols-4 items-center gap-4'>
									<Label htmlFor='new-item-country' className='text-right'>
										Country
									</Label>
									<Select
										value={newItem.country}
										onValueChange={(value) => setNewItem({ ...newItem, country: value })}
										disabled={isAdding}
									>
										<SelectTrigger className='col-span-3'>
											<SelectValue placeholder='Select Country' />
										</SelectTrigger>
										<SelectContent>
											{countries.map((c) => (
												<SelectItem key={c.code} value={c.name}>
													{c.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
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
