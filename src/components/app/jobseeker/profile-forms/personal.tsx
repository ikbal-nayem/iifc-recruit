
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
import { Save, Upload, Mail, Phone, Linkedin, Video } from 'lucide-react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { divisions, districts, upazilas } from '@/lib/bd-divisions-districts-upazilas';
import { useToast } from '@/hooks/use-toast';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormCheckbox } from '@/components/ui/form-checkbox';

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
  religion: z.string().optional(),
  professionalStatus: z.string().optional(),
  
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
      presentAddress: candidate.personalInfo.presentAddress || {},
      permanentAddress: candidate.personalInfo.permanentAddress || {},
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
              variant: 'danger',
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

    // This custom hook prevents infinite loops by only acting on actual changes.
    const usePrevious = <T,>(value: T) => {
        const ref = React.useRef<T>();
        React.useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    };
    const prevDivision = usePrevious(watchDivision);
    const prevDistrict = usePrevious(watchDistrict);

    React.useEffect(() => {
        if (prevDivision !== watchDivision && form.getValues(`${type}.district`)) {
            form.setValue(`${type}.district`, '');
            form.setValue(`${type}.upazila`, '');
        }
    }, [watchDivision, prevDivision, form, type]);

    React.useEffect(() => {
         if (prevDistrict !== watchDistrict && form.getValues(`${type}.upazila`)) {
            form.setValue(`${type}.upazila`, '');
        }
    }, [watchDistrict, prevDistrict, form, type]);


    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormSelect
                    control={form.control}
                    name={`${type}.division`}
                    label="Division"
                    placeholder="Select division"
                    required
                    disabled={disabled}
                    options={divisions.map(d => ({label: d.name, value: d.name}))}
                />
                 <FormSelect
                    control={form.control}
                    name={`${type}.district`}
                    label="District"
                    placeholder="Select district"
                    required
                    disabled={disabled || !watchDivision}
                    options={filteredDistricts.map(d => ({label: d.name, value: d.name}))}
                 />
                <FormSelect
                    control={form.control}
                    name={`${type}.upazila`}
                    label="Upazila / Thana"
                    placeholder="Select upazila"
                    required
                    disabled={disabled || !watchDistrict}
                    options={filteredUpazilas.map(u => ({label: u.name, value: u.name}))}
                 />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormInput
                    control={form.control}
                    name={`${type}.line1`}
                    label="Address Line"
                    disabled={disabled}
                    required
                 />
                 <FormInput
                    control={form.control}
                    name={`${type}.postCode`}
                    label="Post Code"
                    disabled={disabled}
                    required
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
                    <FormInput control={form.control} name="firstName" label="First Name" placeholder="e.g. John" required />
                    <FormInput control={form.control} name="middleName" label="Middle Name" />
                    <FormInput control={form.control} name="lastName" label="Last Name" placeholder="e.g. Doe" required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput control={form.control} name="fatherName" label="Father's Name" required />
                    <FormInput control={form.control} name="motherName" label="Mother's Name" required />
                 </div>
                <FormInput
                    control={form.control}
                    name="headline"
                    label="Headline"
                    placeholder="e.g. Senior Frontend Developer"
                    required
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <FormDatePicker
                        control={form.control}
                        name="dateOfBirth"
                        label="Date of Birth"
                        required
                        captionLayout="dropdown-buttons"
                        fromYear={1960}
                        toYear={new Date().getFullYear() - 18}
                    />
                    <FormInput control={form.control} name="nationality" label="Nationality" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormSelect
                        control={form.control}
                        name="gender"
                        label="Gender"
                        required
                        placeholder="Select gender"
                        options={[
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' },
                            { label: 'Other', value: 'Other' },
                        ]}
                    />
                    <FormSelect
                        control={form.control}
                        name="maritalStatus"
                        label="Marital Status"
                        required
                        placeholder="Select marital status"
                        options={[
                            { label: 'Single', value: 'Single' },
                            { label: 'Married', value: 'Married' },
                            { label: 'Widow', value: 'Widow' },
                            { label: 'Divorce', value: 'Divorce' },
                        ]}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput control={form.control} name="religion" label="Religion" />
                    <FormInput control={form.control} name="professionalStatus" label="Professional Status" />
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
                        <FormCheckbox
                            control={form.control}
                            name="usePresentForPermanent"
                            label="Same as present address"
                        />
                        <div className='mt-4'>
                            <AddressFields type="permanentAddress" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="glassmorphism">
                 <CardHeader>
                    <CardTitle>Identity & Profiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormInput control={form.control} name="nid" label="NID" />
                         <FormInput control={form.control} name="passportNo" label="Passport No." />
                         <FormInput control={form.control} name="birthCertificate" label="Birth Certificate No." />
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
