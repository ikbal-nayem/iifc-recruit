
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
import { FormInput } from '@/components/ui/form-input';

interface AdminProfileFormProps {
  user: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
}

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone number is required'),
  avatarFile: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function AdminProfileForm({ user }: AdminProfileFormProps) {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(user.avatar);
  const nameParts = user.name.split(' ');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email,
      phone: user.phone,
      avatarFile: null,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
           toast({
              title: 'File Too Large',
              description: 'Please upload an image smaller than 10MB.',
              variant: 'danger',
           });
           return;
        }
        form.setValue('avatarFile', file);
        if (avatarPreview && avatarPreview.startsWith('blob:')) {
          URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    toast({
        title: 'Profile Updated',
        description: 'Your personal information has been saved.',
        variant: 'success'
    });
    console.log(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="glassmorphism pt-6">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="avatarFile"
                render={({ field }) => (
                    <FormItem>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                        <Image src={avatarPreview || user.avatar} alt="Admin Avatar" width={80} height={80} className="rounded-full object-cover h-20 w-20" data-ai-hint="avatar person" />
                        <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full" asChild>
                            <FormLabel htmlFor="avatar-upload" className="cursor-pointer">
                                <Upload className="h-4 w-4" />
                                <FormControl>
                                    <Input id="avatar-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} />
                                </FormControl>
                            </FormLabel>
                        </Button>
                        </div>
                        <div>
                        <FormLabel>Profile Photo</FormLabel>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                    </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    placeholder="e.g. John"
                    required
                />
                 <FormInput
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    placeholder="e.g. Doe"
                    required
                />
              </div>

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
    </>
  );
}
