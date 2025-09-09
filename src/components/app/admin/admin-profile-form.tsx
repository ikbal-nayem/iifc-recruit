
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, Upload, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

interface AdminProfileFormProps {
  user: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone number is required'),
  avatar: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function AdminProfileForm({ user }: AdminProfileFormProps) {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
         toast({
            title: 'File Too Large',
            description: 'Please upload an image smaller than 10MB.',
            variant: 'destructive',
         });
         return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      form.setValue('avatar', file);
    }
  };

  React.useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const onSubmit = (data: ProfileFormValues) => {
    toast({
        title: 'Profile Updated',
        description: 'Your personal information has been saved.',
        variant: 'success'
    });
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="glassmorphism">
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image src={avatarPreview || user.avatar} alt="Admin Avatar" width={80} height={80} className="rounded-full object-cover" data-ai-hint="avatar person" />
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full" asChild>
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <Input id="avatar-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/gif" onChange={handleAvatarChange} />
                  </label>
                </Button>
              </div>
              <div className="space-y-2">
                <FormLabel>Profile Photo</FormLabel>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl>
                        <div className="relative flex items-center">
                            <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                            <Input type="email" {...field} className="pl-10" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Phone</FormLabel>
                    <FormControl>
                        <div className="relative flex items-center">
                            <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                            <Input {...field} className="pl-10" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
