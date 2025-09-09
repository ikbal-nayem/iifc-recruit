
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

interface MasterDataCrudProps {
  title: string;
  description: string;
  initialData: string[];
  noun: string; // e.g., "Department", "Skill"
}

export function MasterDataCrud({ title, description, initialData, noun }: MasterDataCrudProps) {
  const { toast } = useToast();
  const [data, setData] = React.useState<string[]>(initialData);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingValue, setEditingValue] = React.useState('');
  const [newValue, setNewValue] = React.useState('');

  const handleAddNew = () => {
    if (newValue.trim() === '') {
        toast({ title: 'Error', description: `${noun} name cannot be empty.`, variant: 'destructive'});
        return;
    }
    if (data.includes(newValue.trim())) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    setData([...data, newValue.trim()]);
    setNewValue('');
    toast({ title: 'Success', description: `${noun} added successfully.`, variant: 'success'});
  };

  const handleUpdate = (index: number) => {
    if (editingValue.trim() === '') {
        toast({ title: 'Error', description: `${noun} name cannot be empty.`, variant: 'destructive'});
        return;
    }
    if (data.includes(editingValue.trim()) && data[index] !== editingValue.trim()) {
        toast({ title: 'Error', description: `This ${noun.toLowerCase()} already exists.`, variant: 'destructive'});
        return;
    }
    const updatedData = [...data];
    updatedData[index] = editingValue.trim();
    setData(updatedData);
    setEditingIndex(null);
    setEditingValue('');
    toast({ title: 'Success', description: `${noun} updated successfully.`, variant: 'success'});
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
                <p className="text-sm">{item}</p>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEditing(index, item)}>
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
