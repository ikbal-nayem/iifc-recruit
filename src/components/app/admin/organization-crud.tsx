
'use client';

import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash, Edit, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { countries } from '@/lib/countries';

interface OrganizationItem {
    name: string;
    fkCountry: string;
    address?: string;
    postCode?: string;
    fkIndustryType?: string;
    fkOrganizationType?: string;
    isActive: boolean;
}

interface OrganizationCrudProps {
  title: string;
  description: string;
  initialData: OrganizationItem[];
  noun: string;
  industryTypes: string[];
  organizationTypes: string[];
}

// Mock API service
const api = {
    add: async (item: OrganizationItem): Promise<OrganizationItem> => {
        console.log('API: Adding item', item);
        await new Promise(resolve => setTimeout(resolve, 500));
        return item;
    },
    update: async (oldName: string, item: OrganizationItem): Promise<OrganizationItem> => {
        console.log('API: Updating item', oldName, 'to', item);
        await new Promise(resolve => setTimeout(resolve, 500));
        return item;
    },
    remove: async (name: string): Promise<void> => {
        console.log('API: Removing item', name);
        await new Promise(resolve => setTimeout(resolve, 500));
    },
    toggle: async (item: OrganizationItem): Promise<OrganizationItem> => {
        console.log('API: Toggling active status for', item.name);
        await new Promise(resolve => setTimeout(resolve, 500));
        return { ...item, isActive: !item.isActive };
    }
}


export function OrganizationCrud({ title, description, initialData, noun, industryTypes, organizationTypes }: OrganizationCrudProps) {
  const { toast } = useToast();
  const [data, setData] = useState<OrganizationItem[]>(initialData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const initialNewState: OrganizationItem = { name: '', fkCountry: '', address: '', postCode: '', fkIndustryType: '', fkOrganizationType: '', isActive: true };
  const [newItem, setNewItem] = useState<OrganizationItem>(initialNewState);
  const [editingItem, setEditingItem] = useState<OrganizationItem | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

  const handleAddNew = async () => {
    if (newItem.name.trim() === '' || newItem.fkCountry.trim() === '') {
        toast({ title: 'Error', description: `Name and country are required.`, variant: 'destructive'});
        return;
    }
    if (data.some(item => item.name.toLowerCase() === newItem.name.trim().toLowerCase())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    setIsLoading(true);
    try {
        const itemToAdd = { ...newItem, name: newItem.name.trim() };
        await api.add(itemToAdd);
        setData([...data, itemToAdd]);
        setNewItem(initialNewState);
        toast({ title: 'Success', description: `${noun} added successfully.`, variant: 'success'});
    } catch (error) {
        toast({ title: 'Error', description: `Failed to add ${noun.toLowerCase()}.`, variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdate = async (index: number) => {
    if (!editingItem || editingItem.name.trim() === '' || editingItem.fkCountry.trim() === '') {
        toast({ title: 'Error', description: `Name and country are required.`, variant: 'destructive'});
        return;
    }
    if (data.some((item, i) => i !== index && item.name.toLowerCase() === editingItem.name.trim().toLowerCase())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    setIsSubmitting(index);
    const originalItem = data[index];
    const updatedItem = { ...editingItem, name: editingItem.name.trim() };
    
    try {
        await api.update(originalItem.name, updatedItem);
        const updatedData = [...data];
        updatedData[index] = updatedItem;
        setData(updatedData);
        setEditingIndex(null);
    } catch (error) {
        toast({ title: 'Error', description: `Failed to update ${noun.toLowerCase()}.`, variant: 'destructive'});
    } finally {
        setIsSubmitting(null);
    }
  };
  
  const handleToggleActive = async (index: number) => {
    const item = data[index];
    try {
        const updatedItem = await api.toggle(item);
        const updatedData = [...data];
        updatedData[index] = updatedItem;
        setData(updatedData);
        toast({ title: 'Status Updated', description: `${updatedItem.name}'s status has been changed.`, variant: 'success' });
    } catch(error) {
         toast({ title: 'Error', description: `Failed to update status.`, variant: 'destructive'});
    }
  };

  const handleRemove = async (index: number) => {
    const itemToRemove = data[index];
     try {
        await api.remove(itemToRemove.name);
        setData(data.filter((_, i) => i !== index));
        toast({ title: 'Success', description: `${noun} removed successfully.`, variant: 'success'});
    } catch(error) {
         toast({ title: 'Error', description: `Failed to remove ${noun.toLowerCase()}.`, variant: 'destructive'});
    }
  };

  const startEditing = (index: number, item: OrganizationItem) => {
    setEditingIndex(index);
    setEditingItem({ ...item });
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingItem(null);
  };

  const renderViewItem = (item: OrganizationItem, index: number) => (
    <Card key={index} className="p-4 flex justify-between items-center bg-background/50">
        <div className="flex-1 space-y-1">
            <p className={`font-semibold ${!item.isActive && 'text-muted-foreground line-through'}`}>{item.name}</p>
            <p className="text-xs text-muted-foreground">
                {item.fkCountry} | Industry: {item.fkIndustryType || 'N/A'} | Type: {item.fkOrganizationType || 'N/A'}
            </p>
            {item.address && <p className="text-xs text-muted-foreground">{item.address}, {item.postCode}</p>}
        </div>
        <div className="flex items-center gap-2">
            <Switch
                checked={item.isActive}
                onCheckedChange={() => handleToggleActive(index)}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(index, item)}>
                <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash className="h-4 w-4 text-destructive" />
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
                        <AlertDialogAction onClick={() => handleRemove(index)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    </Card>
  );

  const renderEditItem = (index: number) => (
    <div key={index} className="p-4 rounded-md border bg-muted/90 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Name" value={editingItem?.name} onChange={(e) => setEditingItem({...editingItem!, name: e.target.value})} />
             <Select value={editingItem?.fkCountry} onValueChange={(value) => setEditingItem({...editingItem!, fkCountry: value})}>
              <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
              <SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Address" value={editingItem?.address} onChange={(e) => setEditingItem({...editingItem!, address: e.target.value})} />
            <Input placeholder="Post Code" value={editingItem?.postCode} onChange={(e) => setEditingItem({...editingItem!, postCode: e.target.value})} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select value={editingItem?.fkIndustryType} onValueChange={(value) => setEditingItem({...editingItem!, fkIndustryType: value})}>
              <SelectTrigger><SelectValue placeholder="Industry Type" /></SelectTrigger>
              <SelectContent>{industryTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={editingItem?.fkOrganizationType} onValueChange={(value) => setEditingItem({...editingItem!, fkOrganizationType: value})}>
              <SelectTrigger><SelectValue placeholder="Organization Type" /></SelectTrigger>
              <SelectContent>{organizationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
        </div>
        <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={cancelEditing} disabled={isSubmitting === index}>Cancel</Button>
            <Button size="sm" onClick={() => handleUpdate(index)} disabled={isSubmitting === index}>
                {isSubmitting === index ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Save
            </Button>
        </div>
    </div>
  );

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-md border bg-muted/50 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} disabled={isLoading} />
                 <Select value={newItem.fkCountry} onValueChange={(value) => setNewItem({...newItem, fkCountry: value})} disabled={isLoading}>
                    <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                    <SelectContent>{countries.map(c => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="Address" value={newItem.address} onChange={(e) => setNewItem({...newItem, address: e.target.value})} disabled={isLoading} />
                <Input placeholder="Post Code" value={newItem.postCode} onChange={(e) => setNewItem({...newItem, postCode: e.target.value})} disabled={isLoading} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select value={newItem.fkIndustryType} onValueChange={(value) => setNewItem({...newItem, fkIndustryType: value})} disabled={isLoading}>
                    <SelectTrigger><SelectValue placeholder="Industry Type" /></SelectTrigger>
                    <SelectContent>{industryTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
                 <Select value={newItem.fkOrganizationType} onValueChange={(value) => setNewItem({...newItem, fkOrganizationType: value})} disabled={isLoading}>
                    <SelectTrigger><SelectValue placeholder="Organization Type" /></SelectTrigger>
                    <SelectContent>{organizationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <div className="flex justify-end">
                <Button onClick={handleAddNew} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Add New {noun}
                </Button>
            </div>
        </div>
        <div className="space-y-2 pt-4">
          {data.map((item, index) => (
             editingIndex === index ? renderEditItem(index) : renderViewItem(item, index)
          ))}
          {data.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No {noun.toLowerCase()}s found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
