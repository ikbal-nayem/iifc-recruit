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
  const [editingName, setEditingName] = useState('');
  const [editingCountry, setEditingCountry] = useState('');
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<number | null>(null);

  const handleAddNew = async () => {
    if (newName.trim() === '' || newCountry.trim() === '') {
        toast({ title: 'Error', description: `Institution name and country cannot be empty.`, variant: 'destructive'});
        return;
    }
    if (data.some(item => item.name.toLowerCase() === newName.trim().toLowerCase())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    setIsLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const newItem: InstitutionItem = { name: newName.trim(), country: newCountry, isActive: true };
    setData([...data, newItem]);
    setNewName('');
    setNewCountry('');
    toast({ title: 'Success', description: `${noun} added successfully.`, variant: 'success'});
    setIsLoading(false);
  };

  const handleUpdate = async (index: number) => {
    if (editingName.trim() === '' || editingCountry.trim() === '') {
        toast({ title: 'Error', description: `Institution name and country cannot be empty.`, variant: 'destructive'});
        return;
    }
    if (data.some((item, i) => i !== index && item.name.toLowerCase() === editingName.trim().toLowerCase())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    setIsSubmitting(index);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], name: editingName.trim(), country: editingCountry };
    setData(updatedData);
    setEditingIndex(null);
    setIsSubmitting(null);
  };
  
  const handleToggleActive = async (index: number) => {
    const item = data[index];
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const updatedItem = { ...item, isActive: !item.isActive };
    const updatedData = [...data];
    updatedData[index] = updatedItem;
    setData(updatedData);
    toast({ title: 'Status Updated', description: `${updatedItem.name}'s status has been changed.`, variant: 'success' });
  };

  const handleRemove = async (index: number) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setData(data.filter((_, i) => i !== index));
    toast({ title: 'Success', description: `${noun} removed successfully.`, variant: 'success'});
  };

  const startEditing = (index: number, item: InstitutionItem) => {
    setEditingIndex(index);
    setEditingName(item.name);
    setEditingCountry(item.country);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingName('');
    setEditingCountry('');
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder={`Add new ${noun.toLowerCase()}...`}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={isLoading}
          />
          <Select value={newCountry} onValueChange={setNewCountry} disabled={isLoading}>
              <SelectTrigger className="sm:w-[200px]">
                  <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                  {countries.map(c => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
          </Select>
          <Button onClick={handleAddNew} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
             Add
          </Button>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
             <AlertDialog key={index}>
              <div className="flex items-center justify-between p-2 rounded-md border bg-background/50">
                {editingIndex === index ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-9" autoFocus disabled={isSubmitting === index}
                    />
                    <Select value={editingCountry} onValueChange={setEditingCountry} disabled={isSubmitting === index}>
                        <SelectTrigger className="h-9 sm:w-[200px]">
                            <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map(c => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-1">
                      <Switch
                          id={`active-switch-${index}`}
                          checked={item.isActive}
                          onCheckedChange={() => handleToggleActive(index)}
                        />
                      <div>
                        <p className={`text-sm ${!item.isActive && 'text-muted-foreground line-through'}`}>{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.country}</p>
                      </div>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(index, item)}>
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
