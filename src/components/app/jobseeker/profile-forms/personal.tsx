

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
import { Save, Upload, Mail, Phone, Check, ChevronsUpDown, Linkedin, Video } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface ProfileFormProps {
  candidate: Candidate;
}

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone number is required'),
  headline: z.string().min(1, 'Headline is required'),
  
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  maritalStatus: z.enum(['Single', 'Married', 'Widow', 'Divorce']),
  nationality: z.string().min(1, 'Nationality is required'),
  
  nid: z.string().optional(),
  passportNo: z.string().optional(),
  birthCertificate: z.string().optional(),

  presentAddress: z.object({
    division: z.string().min(1, 'Division is required'),
    district: z.string().min(1, 'District is required'),
    upazila: z.string().min(1, 'Upazila is required'),
    line1: z.string().min(1, 'Address line is required'),
    postCode: z.string().min(1, 'Post code is required'),
  }),
  
  usePresentForPermanent: z.boolean().default(false),
  
  permanentAddress: z.object({
    division: z.string().min(1, 'Division is required'),
    district: z.string().min(1, 'District is required'),
    upazila: z.string().min(1, 'Upazila is required'),
    line1: z.string().min(1, 'Address line is required'),
    postCode: z.string().min(1, 'Post code is required'),
  }),

  linkedInProfile: z.string().url().optional().or(z.literal('')),
  videoProfile: z.string().url().optional().or(z.literal('')),

  avatarFile: z.any().optional(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export function ProfileFormPersonal({ candidate }: ProfileFormProps) {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(candidate.personalInfo.avatar);

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      ...candidate.personalInfo,
      presentAddress: candidate.personalInfo.presentAddress,
      permanentAddress: candidate.personalInfo.permanentAddress,
      usePresentForPermanent: false,
      avatarFile: null,
    },
  });

  const watchPresentAddress = form.watch('presentAddress');
  const usePresentForPermanent = form.watch('usePresentForPermanent');

  React.useEffect(() => {
    if (usePresentForPermanent) {
      form.setValue('permanentAddress', watchPresentAddress);
    }
  }, [usePresentForPermanent, watchPresentAddress, form]);


   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        form.setValue('avatarFile', file);
        if (avatarPreview && avatarPreview !== candidate.personalInfo.avatar) {
          URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview(URL.createObjectURL(file));
    }
  };


  const onSubmit = (data: PersonalInfoFormValues) => {
    toast({
        title: 'Profile Updated',
        description: 'Your personal information has been saved.',
        variant: 'success'
    });
    console.log(data);
  };
  
  const AddressFields = ({ type }: { type: 'presentAddress' | 'permanentAddress' }) => {
    const watchDivision = form.watch(`${type}.division`);
    const watchDistrict = form.watch(`${type}.district`);
    const disabled = type === 'permanentAddress' && usePresentForPermanent;

    const filteredDistricts = React.useMemo(() => {
        const selectedDivision = divisions.find(d => d.name === watchDivision);
        if (!selectedDivision) return [];
        return districts.filter(d => d.division_id === selectedDivision.id);
    }, [watchDivision]);

    const filteredUpazilas = React.useMemo(() => {
        const selectedDistrict = districts.find(d => d.name === watchDistrict);
        if (!selectedDistrict) return [];
        return upazilas.filter(u => u.district_id === selectedDistrict.id);
    }, [watchDistrict]);

    React.useEffect(() => {
        if (type === 'presentAddress') {
            form.setValue(`${type}.district`, '');
            form.setValue(`${type}.upazila`, '');
        }
    }, [watchDivision]);

    React.useEffect(() => {
        if (type === 'presentAddress') {
            form.setValue(`${type}.upazila`, '');
        }
    }, [watchDistrict]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name={`${type}.division`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Division</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select division" /></SelectTrigger>
                                </FormControl>
                                <SelectContent><Command><CommandInput placeholder="Search..."/><CommandList>{divisions.map(d => <CommandItem onSelect={() => field.onChange(d.name)} value={d.name} key={d.id}><SelectItem value={d.name}>{d.name}</SelectItem></CommandItem>)}</CommandList></Command></SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name={`${type}.district`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>District</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value} disabled={disabled || !watchDivision}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select district" /></SelectTrigger>
                                </FormControl>
                                <SelectContent><Command><CommandInput placeholder="Search..."/><CommandList>{filteredDistricts.map(d => <CommandItem onSelect={() => field.onChange(d.name)} value={d.name} key={d.id}><SelectItem value={d.name}>{d.name}</SelectItem></CommandItem>)}</CommandList></Command></SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name={`${type}.upazila`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Upazila / Thana</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value} disabled={disabled || !watchDistrict}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select upazila" /></SelectTrigger>
                                </FormControl>
                                <SelectContent><Command><CommandInput placeholder="Search..."/><CommandList>{filteredUpazilas.map(u => <CommandItem onSelect={() => field.onChange(u.name)} value={u.name} key={u.id}><SelectItem value={u.name}>{u.name}</SelectItem></CommandItem>)}</CommandList></Command></SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name={`${type}.line1`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Address Line</FormLabel>
                            <FormControl><Input {...field} disabled={disabled} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name={`${type}.postCode`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Post Code</FormLabel>
                            <FormControl><Input {...field} disabled={disabled} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
            <Card className="glassmorphism">
            <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>This is your public-facing information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <FormField
                control={form.control}
                name="avatarFile"
                render={({ field }) => (
                    <FormItem>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                        <Image src={avatarPreview || candidate.personalInfo.avatar} alt="Candidate Avatar" width={80} height={80} className="rounded-full object-cover w-20 h-20" data-ai-hint="avatar person" />
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel required>First Name</FormLabel>
                        <FormControl><Input placeholder="e.g. John" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
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
                        <FormControl><Input placeholder="e.g. Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Father's Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                      <FormField
                        control={form.control}
                        name="motherName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Mother's Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
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
                        <FormControl><Input placeholder="e.g. Senior Frontend Developer" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Date of Birth</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Nationality</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Gender</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maritalStatus"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel required>Marital Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select marital status" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Single">Single</SelectItem>
                                    <SelectItem value="Married">Married</SelectItem>
                                    <SelectItem value="Widow">Widow</SelectItem>
                                    <SelectItem value="Divorce">Divorce</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </CardContent>
            </Card>

            <Card className="glassmorphism">
                 <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        <h3 className="text-md font-medium mb-2">Present Address</h3>
                        <AddressFields type="presentAddress" />
                    </div>
                    <div>
                        <h3 className="text-md font-medium mb-2">Permanent Address</h3>
                        <FormField
                            control={form.control}
                            name="usePresentForPermanent"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <FormLabel className="font-normal">Same as present address</FormLabel>
                                </FormItem>
                            )}
                            />
                        <AddressFields type="permanentAddress" />
                    </div>
                </CardContent>
            </Card>

            <Card className="glassmorphism">
                 <CardHeader>
                    <CardTitle>Identity & Profiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormField control={form.control} name="nid" render={({ field }) => (<FormItem><FormLabel>NID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={form.control} name="passportNo" render={({ field }) => (<FormItem><FormLabel>Passport No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                         <FormField control={form.control} name="birthCertificate" render={({ field }) => (<FormItem><FormLabel>Birth Certificate No.</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <FormField
                            control={form.control}
                            name="linkedInProfile"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>LinkedIn Profile</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Linkedin className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                        <Input {...field} className="pl-10" placeholder="https://linkedin.com/in/..." />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="videoProfile"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Video Profile</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center">
                                        <Video className="absolute left-3 h-4 w-4 text-muted-foreground" />
                                        <Input {...field} className="pl-10" placeholder="https://youtube.com/watch?v=..." />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>
            
            <CardFooter>
                <Button type="submit">
                <Save className="mr-2 h-4 w-4" />Save Changes
                </Button>
            </CardFooter>
        </div>
    </form>
    </Form>
  );
}
