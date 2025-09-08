
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { Candidate } from '@/lib/types';
import { Save, Upload, Mail, Phone, Check, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { divisions, districts, upazilas } from '@/lib/bd-divisions-districts-upazilas';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProfileFormProps {
  candidate: Candidate;
}

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone number is required'),
  headline: z.string().min(1, 'Headline is required'),
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  upazila: z.string().min(1, 'Upazila is required'),
  line1: z.string().min(1, 'Address line is required'),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export function ProfileFormPersonal({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: candidate.personalInfo.firstName,
      lastName: candidate.personalInfo.lastName,
      email: candidate.personalInfo.email,
      phone: candidate.personalInfo.phone,
      headline: candidate.personalInfo.headline,
      division: candidate.personalInfo.address.division,
      district: candidate.personalInfo.address.district,
      upazila: candidate.personalInfo.address.upazila,
      line1: candidate.personalInfo.address.line1,
    },
  });

  const watchDivision = form.watch('division');
  const watchDistrict = form.watch('district');

  const filteredDistricts = React.useMemo(() => {
    const selectedDivision = divisions.find(d => d.name.toLowerCase() === watchDivision?.toLowerCase());
    if (!selectedDivision) return [];
    return districts.filter(d => d.division_id === selectedDivision.id);
  }, [watchDivision]);

  const filteredUpazilas = React.useMemo(() => {
    const selectedDistrict = districts.find(d => d.name.toLowerCase() === watchDistrict?.toLowerCase());
    if (!selectedDistrict) return [];
    return upazilas.filter(u => u.district_id === selectedDistrict.id);
  }, [watchDistrict]);

  React.useEffect(() => {
    form.setValue('district', '');
  }, [watchDivision, form]);

   React.useEffect(() => {
    form.setValue('upazila', '');
  }, [watchDistrict, form]);


  const onSubmit = (data: PersonalInfoFormValues) => {
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
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>This is your public-facing information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image src={candidate.personalInfo.avatar} alt="Candidate Avatar" width={80} height={80} className="rounded-full" data-ai-hint="avatar person" />
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Upload className="h-4 w-4" />
                  <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </Button>
              </div>
              <div className="space-y-2">
                <FormLabel>Profile Photo</FormLabel>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Headline</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Frontend Developer" {...field} />
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
            <div>
              <FormLabel required>Address</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                 <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel required className="text-xs">Division</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                                {field.value ? divisions.find((d) => d.name === field.value)?.name : "Select division"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                           <Command>
                                <CommandInput placeholder="Search division..." />
                                <CommandList>
                                <CommandEmpty>No division found.</CommandEmpty>
                                <CommandGroup>
                                    {divisions.map((division) => (
                                    <CommandItem
                                        value={division.name}
                                        key={division.id}
                                        onSelect={() => {
                                        form.setValue("division", division.name)
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", division.name === field.value ? "opacity-100" : "opacity-0")} />
                                        {division.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel required className="text-xs">District</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                disabled={!watchDivision}
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                                {field.value ? filteredDistricts.find((d) => d.name === field.value)?.name : "Select district"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search district..." />
                                <CommandList>
                                <CommandEmpty>No district found.</CommandEmpty>
                                <CommandGroup>
                                    {filteredDistricts.map((district) => (
                                    <CommandItem
                                        value={district.name}
                                        key={district.id}
                                        onSelect={() => {
                                        form.setValue("district", district.name)
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", district.name === field.value ? "opacity-100" : "opacity-0")} />
                                        {district.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="upazila"
                    render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel required className="text-xs">Upazila / Thana</FormLabel>
                        <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                disabled={!watchDistrict}
                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                            >
                                {field.value ? filteredUpazilas.find((u) => u.name === field.value)?.name : "Select upazila"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search upazila..." />
                                <CommandList>
                                <CommandEmpty>No upazila found.</CommandEmpty>
                                <CommandGroup>
                                    {filteredUpazilas.map((upazila) => (
                                    <CommandItem
                                        value={upazila.name}
                                        key={upazila.id}
                                        onSelect={() => {
                                        form.setValue("upazila", upazila.name)
                                        }}
                                    >
                                        <Check className={cn("mr-2 h-4 w-4", upazila.name === field.value ? "opacity-100" : "opacity-0")} />
                                        {upazila.name}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <div className="space-y-2 mt-4">
                 <FormField
                    control={form.control}
                    name="line1"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel required className="text-xs">Address Line 1</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
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
