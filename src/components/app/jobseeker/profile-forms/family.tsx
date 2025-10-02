'use client';

import { EnumOption } from '@/app/(auth)/jobseeker/profile-edit/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { useToast } from '@/hooks/use-toast';
import { ChildInfo, FamilyInfo } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, PlusCircle, Save, Trash } from 'lucide-react';
import React, { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

const childSchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1, 'Child name is required.'),
	gender: z.string().min(1, 'Gender is required.'),
	dateOfBirth: z.string().min(1, 'Date of birth is required.'),
});

const familySchema = z.object({
	id: z.number().optional(),
	spouseName: z.string().min(1, "Spouse's name is required."),
	spouseProfession: z.string().min(1, "Spouse's profession is required."),
	spouseStatus: z.string().min(1, 'Spouse status is required.'),
	spouseOwnDistrictId: z.coerce.number().optional(),
	children: z.array(childSchema).optional(),
});

type FamilyFormValues = z.infer<typeof familySchema>;

interface ProfileFormFamilyProps {
	districts: ICommonMasterData[];
	initialData?: FamilyInfo;
	spouseStatuses: EnumOption[];
}

export function ProfileFormFamily({ districts, initialData, spouseStatuses }: ProfileFormFamilyProps) {
	const { toast } = useToast();
	const [isSaving, setIsSaving] = useState(false);

	const form = useForm<FamilyFormValues>({
		resolver: zodResolver(familySchema),
		defaultValues: {
			...initialData,
			children: initialData?.children || [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'children',
	});

	const onSubmit = async (data: FamilyFormValues) => {
		setIsSaving(true);
		try {
			const response = await JobseekerProfileService.family.save(data as FamilyInfo);
			toast({ description: response.message || 'Family information saved.', variant: 'success' });
			// The API might return the updated data with new IDs, so we reset the form with it.
			form.reset(response.body);
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error?.message || 'Failed to save family information.',
				variant: 'danger',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
				<Card className='glassmorphism'>
					<CardHeader>
						<CardTitle>Spouse Information</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormInput
								control={form.control}
								name='spouseName'
								label="Spouse's Name"
								required
								placeholder="Spouse's full name"
							/>
							<FormInput
								control={form.control}
								name='spouseProfession'
								label="Spouse's Profession"
								required
								placeholder='e.g., Doctor, Teacher'
							/>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<FormSelect
								control={form.control}
								name='spouseStatus'
								label='Spouse Status'
								required
								placeholder='Select a status'
								options={spouseStatuses}
							/>
							<FormAutocomplete
								control={form.control}
								name='spouseOwnDistrictId'
								label="Spouse's Home District"
								placeholder='Select a district'
								options={districts.map((d) => ({ value: d.id!, label: d.name }))}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className='glassmorphism'>
					<CardHeader>
						<div className='flex justify-between items-center'>
							<div>
								<CardTitle>Children Information</CardTitle>
								<CardDescription>Add details for each of your children.</CardDescription>
							</div>
							<Button
								type='button'
								variant='outline'
								onClick={() =>
									append({
										name: '',
										gender: '',
										dateOfBirth: '',
									})
								}
							>
								<PlusCircle className='mr-2 h-4 w-4' /> Add Child
							</Button>
						</div>
					</CardHeader>
					<CardContent className='space-y-4'>
						{fields.map((field, index) => (
							<div key={field.id} className='p-4 border rounded-lg relative space-y-4'>
								<p className='font-medium'>Child {index + 1}</p>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
									<FormInput
										control={form.control}
										name={`children.${index}.name`}
										label='Name'
										required
										placeholder="Child's Name"
									/>
									<FormSelect
										control={form.control}
										name={`children.${index}.gender`}
										label='Gender'
										required
										placeholder='Select gender'
										options={[
											{ value: 'Male', label: 'Male' },
											{ value: 'Female', label: 'Female' },
											{ value: 'Other', label: 'Other' },
										]}
									/>
									<FormDatePicker
										control={form.control}
										name={`children.${index}.dateOfBirth`}
										label='Date of Birth'
										required
										fromYear={new Date().getFullYear() - 50}
										toYear={new Date().getFullYear()}
										captionLayout='dropdown-buttons'
									/>
								</div>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='absolute top-2 right-2 h-8 w-8'
									onClick={() => remove(index)}
								>
									<Trash className='h-4 w-4 text-danger' />
								</Button>
							</div>
						))}
						{fields.length === 0 && (
							<p className='text-center text-muted-foreground py-4'>No children added yet.</p>
						)}
					</CardContent>
				</Card>

				<div className='flex justify-center pt-4'>
					<Button type='submit' disabled={isSaving}>
						{isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
						Save Family Information
					</Button>
				</div>
			</form>
		</Form>
	);
}
