'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash, Edit, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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

export function MasterDataCrud({ title, description, initialData, noun }: MasterDataCrudProps) {
  const { toast } = useToast();
  const [data, setData] = React.useState<MasterDataItem[]>(initialData);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingValue, setEditingValue] = React.useState('');
  const [newValue, setNewValue] = React.useState('');

  const handleAddNew = () => {
    if (newValue.trim() === '') {
        toast({ title: 'Error', description: `${noun} name cannot be empty.`, variant: 'destructive'});
        return;
    }
    if (data.some(item => item.name.toLowerCase() === newValue.trim().toLowerCase())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    setData([...data, { name: newValue.trim(), isActive: true }]);
    setNewValue('');
    toast({ title: 'Success', description: `${noun} added successfully.`, variant: 'success'});
  };

  const handleUpdate = (index: number) => {
    if (editingValue.trim() === '') {
        toast({ title: 'Error', description: `${noun} name cannot be empty.`, variant: 'destructive'});
        return;
    }
    if (data.some((item, i) => i !== index && item.name.toLowerCase() === editingValue.trim().toLowerCase())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    const updatedData = [...data];
    updatedData[index].name = editingValue.trim();
    setData(updatedData);
    setEditingIndex(null);
    setEditingValue('');
    toast({ title: 'Success', description: `${noun} updated successfully.`, variant: 'success'});
  };
  
  const handleToggleActive = (index: number) => {
    const updatedData = [...data];
    updatedData[index].isActive = !updatedData[index].isActive;
    setData(updatedData);
    toast({ title: 'Status Updated', description: `${updatedData[index].name}'s status has been changed.`, variant: 'success' });
  };

  const handleRemove = (index: number) => {
    setData(data.filter((_, i) => i !== index));
    toast({ title: 'Success', description: `${noun} removed successfully.`, variant: 'success'});
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
          />
          <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-md border bg-background/50">
              {editingIndex === index ? (
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(index)}
                  className="h-8"
                  autoFocus
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
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUpdate(index)}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelEditing}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(index, item.name)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemove(index)}>
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No {noun.toLowerCase()}s found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}