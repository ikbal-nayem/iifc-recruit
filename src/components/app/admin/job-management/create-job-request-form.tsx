'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, PlusCircle, Trash } from 'lucide-react';
import { FormInput } from '@/components/ui/form-input';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import {
	IClientOrganization,
	IOutsourcingService,
	IOutsourcingZone,
} from '@/interfaces/master-data.interface';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormRadioGroup } from '@/components/ui/form-radio-group';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const outsourcingVacancySchema = z.object({
	serviceId: z.coerce.number().min(1, 'Service Post is required.'),
	zoneId: z.coerce.number().min(1, 'Zone is required.'),
	vacancyCount: z.coerce.number().min(1, 'Number of vacancies must be at least 1.'),
});

const jobRequestSchema = z.object({
	clientOrganizationId: z.coerce.number().min(1, 'Client Organization is required.'),
	positionType: z.enum(['Permanent', 'Outsourcing']),
	// Permanent position fields
	title: z.string().optional(),
	department: z.string().optional(),
	location: z.string().optional(),
	vacancyCount: z.coerce.number().optional(),
	// Outsourcing fields
	outsourcingVacancies: z.array(outsourcingVacancySchema).optional(),
	// Common fields
	applicationDeadline: z.string().min(1, 'Application deadline is required.'),
	description: z.string().min(10, 'Description must be at least 10 characters.'),
	responsibilities: z.string().min(10, 'Responsibilities must be at least 10 characters.'),
	requirements: z.string().min(10, 'Requirements must be at least 10 characters.'),
}).refine((data) => {
    if (data.positionType === 'Permanent') {
        return !!data.title && !!data.department && !!data.location && (data.vacancyCount || 0) > 0;
    }
    if (data.positionType === 'Outsourcing') {
        return !!data.outsourcingVacancies && data.outsourcingVacancies.length > 0;
    }
    return false;
}, {
    message: "Please fill in the required fields for the selected position type.",
    path: ["title"], // This error will be shown on a field that is always visible
});


type JobRequestFormValues = z.infer<typeof jobRequestSchema>;

interface CreateJobRequestFormProps {
	clientOrganizations: IClientOrganization[];
	outsourcingServices: IOutsourcingService[];
	outsourcingZones: IOutsourcingZone[];
}

export function CreateJobRequestForm({
	clientOrganizations,
	outsourcingServices,
	outsourcingZones,
}: CreateJobRequestFormProps) {
	const { toast } = useToast();
	const form = useForm<JobRequestFormValues>({
		resolver: zodResolver(jobRequestSchema),
		defaultValues: {
			positionType: 'Permanent',
            outsourcingVacancies: [{ serviceId: undefined, zoneId: undefined, vacancyCount: 1 }]
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'outsourcingVacancies',
	});

	const watchPositionType = form.watch('positionType');

	function onSubmit(data: JobRequestFormValues) {
		console.log(data);
		toast({
			title: 'Job Request Submitted!',
			description: `The request has been submitted for approval.`,
			variant: 'success',
		});
		form.reset();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<Card className='glassmorphism'>
					<CardHeader>
						<CardTitle>Job Request Details</CardTitle>
					</CardHeader>
					<CardContent className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
							<FormAutocomplete
								control={form.control}
								name='clientOrganizationId'
								label='Client Organization'
								placeholder='Select a client'
								required
								options={clientOrganizations}
								getOptionValue={(option) => option.id!.toString()}
								getOptionLabel={(option) => option.nameEn}
							/>
							<FormRadioGroup
								control={form.control}
								name='positionType'
								label='Position Type'
								required
								options={[
									{ label: 'Permanent', value: 'Permanent' },
									{ label: 'Outsourcing', value: 'Outsourcing' },
								]}
							/>
						</div>

						<div
							className={cn(
								'space-y-6 animate-in fade-in',
								watchPositionType !== 'Permanent' && 'hidden'
							)}
						>
							<Separator />
							<h3 className='font-medium text-lg'>Permanent Position Details</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormInput
									control={form.control}
									name='title'
									label='Job Title'
									placeholder='e.g. Senior Frontend Developer'
									required={watchPositionType === 'Permanent'}
								/>
								<FormInput
									control={form.control}
									name='department'
									label='Department'
									placeholder='e.g. Engineering'
									required={watchPositionType === 'Permanent'}
								/>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<FormInput
									control={form.control}
									name='location'
									label='Location'
									placeholder='e.g. Dhaka, Bangladesh'
									required={watchPositionType === 'Permanent'}
								/>
								<FormInput
									control={form.control}
									name='vacancyCount'
									label='Number of Vacancies'
									type='number'
									placeholder='e.g. 5'
									required={watchPositionType === 'Permanent'}
								/>
							</div>
						</div>

						<div
							className={cn(
								'space-y-4 animate-in fade-in',
								watchPositionType !== 'Outsourcing' && 'hidden'
							)}
						>
							<Separator />
							<h3 className='font-medium text-lg'>Outsourcing Position Details</h3>
							{fields.map((field, index) => (
								<Card key={field.id} className='p-4 relative bg-muted/50'>
									<CardContent className='p-0 space-y-4'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
											<FormAutocomplete
												control={form.control}
												name={`outsourcingVacancies.${index}.serviceId`}
												label='Service Post'
												required
												placeholder='Select Service'
												options={outsourcingServices}
												getOptionValue={(opt) => opt.id!.toString()}
												getOptionLabel={(opt) => opt.nameEn}
											/>
											<FormAutocomplete
												control={form.control}
												name={`outsourcingVacancies.${index}.zoneId`}
												label='Zone'
												required
												placeholder='Select Zone'
												options={outsourcingZones}
												getOptionValue={(opt) => opt.id!.toString()}
												getOptionLabel={(opt) => opt.nameEn}
											/>
											<FormInput
												control={form.control}
												name={`outsourcingVacancies.${index}.vacancyCount`}
												label='Vacancies'
												required
												type='number'
												placeholder='e.g., 10'
											/>
										</div>
									</CardContent>
									{index > 0 && (
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='absolute top-1 right-1 h-7 w-7'
											onClick={() => remove(index)}
										>
											<Trash className='h-4 w-4 text-danger' />
										</Button>
									)}
								</Card>
							))}
							<Button
								type='button'
								variant='outline'
								onClick={() =>
									append({
										serviceId: undefined,
										zoneId: undefined,
										vacancyCount: 1,
									})
								}
							>
								<PlusCircle className='mr-2 h-4 w-4' /> Add Another Service Post
							</Button>
						</div>

						<Separator />
						<h3 className='font-medium text-lg'>Common Details</h3>

						<FormDatePicker control={form.control} name='applicationDeadline' label='Application Deadline' required />

						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Job Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Provide a detailed description of the job.'
											className='min-h-[150px]'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='responsibilities'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Responsibilities</FormLabel>
									<FormControl>
										<Textarea
											placeholder='List the key responsibilities. Enter each on a new line.'
											className='min-h-[150px]'
											{...field}
										/>
									</FormControl>
									<FormDescription>Enter each responsibility on a new line.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='requirements'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Requirements</FormLabel>
									<FormControl>
										<Textarea
											placeholder='List the job requirements. Enter each on a new line.'
											className='min-h-[150px]'
											{...field}
										/>
									</FormControl>
									<FormDescription>Enter each requirement on a new line.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</CardContent>
					<CardFooter>
						<Button type='submit'>
							<Send className='mr-2 h-4 w-4' />
							Submit Request
						</Button>
					</CardFooter>
				</Card>
			</form>
		</Form>
	);
}
