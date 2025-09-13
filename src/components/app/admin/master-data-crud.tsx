
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


interface MasterDataItem {
    name: string;
    isActive: boolean;
}

interface MasterDataCrudProps {
  title: string;
  description: string;
  initialData: MasterDataItem[];
  noun: string; // e.g., "Department", "Skill"
}

// Mock API service
const masterDataApi = {
    add: async (item: MasterDataItem): Promise<MasterDataItem> => {
        console.log('API: Adding item', item);
        await new Promise(resolve => setTimeout(resolve, 500));
        // In a real app, you would get the created item back from the API
        return item;
    },
    update: async (oldName: string, item: MasterDataItem): Promise<MasterDataItem> => {
        console.log('API: Updating item', oldName, 'to', item);
        await new Promise(resolve => setTimeout(resolve, 500));
        return item;
    },
    remove: async (name: string): Promise<void> => {
        console.log('API: Removing item', name);
        await new Promise(resolve => setTimeout(resolve, 500));
    },
    toggle: async (item: MasterDataItem): Promise<MasterDataItem> => {
        console.log('API: Toggling active status for', item.name);
        await new Promise(resolve => setTimeout(resolve, 500));
        return { ...item, isActive: !item.isActive };
    }
}


export function MasterDataCrud({ title, description, initialData, noun }: MasterDataCrudProps) {
  const { toast } = useToast();
  const [data, setData] = useState<MasterDataItem[]>(initialData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

  const handleAddNew = async () => {
    if (newValue.trim() === '') {
        toast({ title: 'Error', description: `${noun} name cannot be empty.`, variant: 'destructive'});
        return;
    }
    if (data.some(item => item.name.toLowerCase() === newValue.trim().toLowerCase())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    setIsLoading(true);
    try {
        const newItem = { name: newValue.trim(), isActive: true };
        await masterDataApi.add(newItem);
        setData([...data, newItem]);
        setNewValue('');
        toast({ title: 'Success', description: `${noun} added successfully.`, variant: 'success'});
    } catch (error) {
        toast({ title: 'Error', description: `Failed to add ${noun.toLowerCase()}.`, variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdate = async (index: number) => {
    if (editingValue.trim() === '') {
        toast({ title: 'Error', description: `${noun} name cannot be empty.`, variant: 'destructive'});
        return;
    }
    if (data.some((item, i) => i !== index && item.name.toLowerCase() === editingValue.trim().toLowerCase())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    setIsSubmitting(index);
    const originalItem = data[index];
    const updatedItem = { ...originalItem, name: editingValue.trim() };
    
    try {
        await masterDataApi.update(originalItem.name, updatedItem);
        const updatedData = [...data];
        updatedData[index] = updatedItem;
        setData(updatedData);
        setEditingIndex(null);
        setEditingValue('');
        toast({ title: 'Success', description: `${noun} updated successfully.`, variant: 'success'});
    } catch (error) {
        toast({ title: 'Error', description: `Failed to update ${noun.toLowerCase()}.`, variant: 'destructive'});
    } finally {
        setIsSubmitting(null);
    }
  };
  
  const handleToggleActive = async (index: number) => {
    const item = data[index];
    try {
        const updatedItem = await masterDataApi.toggle(item);
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
        await masterDataApi.remove(itemToRemove.name);
        setData(data.filter((_, i) => i !== index));
        toast({ title: 'Success', description: `${noun} removed successfully.`, variant: 'success'});
    } catch(error) {
         toast({ title: 'Error', description: `Failed to remove ${noun.toLowerCase()}.`, variant: 'destructive'});
    }
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
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder={`Add a new ${noun.toLowerCase()}...`}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNew()}
            disabled={isLoading}
          />
          <Button onClick={handleAddNew} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
             Add
          </Button>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
             <AlertDialog key={index}>
              <div className="flex items-center justify-between p-2 rounded-md border bg-background/50">
                {editingIndex === index ? (
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(index)}
                    className="h-8"
                    autoFocus
                    disabled={isSubmitting === index}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                      <Switch
                          id={`active-switch-${index}`}
                          checked={item.isActive}
                          onCheckedChange={() => handleToggleActive(index)}
                        />
                      <p className={`text-sm ${!item.isActive && 'text-muted-foreground line-through'}`}>{item.name}</p>
                  </div>
                )}
                <div className="flex gap-1">
                  {editingIndex === index ? (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdate(index)} disabled={isSubmitting === index}>
                         {isSubmitting === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-green-600" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditing} disabled={isSubmitting === index}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(index, item.name)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                    </>
                  )}
                </div>
                 <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the {noun.toLowerCase()} &quot;{item.name}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemove(index)} className="bg-destructive hover:bg-destructive/90">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
              </div>
            </AlertDialog>
          ))}
          {data.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No {noun.toLowerCase()}s found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

