'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Send } from 'lucide-react';
import { FormInput } from '@/components/ui/form-input';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormRadioGroup } from '@/components/ui/form-radio-group';

const jobRequestSchema = z.object({
	clientOrganizationId: z.coerce.number().min(1, 'Client Organization is required.'),
	positionType: z.enum(['Permanent', 'Outsourcing']),
	title: z.string().min(1, 'Title is required.'),
	department: z.string().min(1, 'Department is required.'),
	location: z.string().min(1, 'Location is required.'),
	vacancyCount: z.coerce.number().min(1, 'Number of vacancies is required.'),
	applicationDeadline: z.string().min(1, 'Application deadline is required.'),
	description: z.string().min(10, 'Description must be at least 10 characters.'),
	responsibilities: z.string().min(10, 'Responsibilities must be at least 10 characters.'),
	requirements: z.string().min(10, 'Requirements must be at least 10 characters.'),
});

type JobRequestFormValues = z.infer<typeof jobRequestSchema>;

interface CreateJobRequestFormProps {
	clientOrganizations: IClientOrganization[];
}

export function CreateJobRequestForm({ clientOrganizations }: CreateJobRequestFormProps) {
	const { toast } = useToast();
	const form = useForm<JobRequestFormValues>({
		resolver: zodResolver(jobRequestSchema),
		defaultValues: {
			positionType: 'Permanent',
		},
	});

	function onSubmit(data: JobRequestFormValues) {
		console.log(data);
		toast({
			title: 'Job Request Submitted!',
			description: `The request for "${data.title}" has been submitted for approval.`,
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
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<FormInput
								control={form.control}
								name='title'
								label='Job Title'
								placeholder='e.g. Senior Frontend Developer'
								required
							/>
							<FormInput
								control={form.control}
								name='department'
								label='Department'
								placeholder='e.g. Engineering'
								required
							/>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							<FormInput
								control={form.control}
								name='location'
								label='Location'
								placeholder='e.g. Dhaka, Bangladesh'
								required
							/>
							<FormInput
								control={form.control}
								name='vacancyCount'
								label='Number of Vacancies'
								type='number'
								placeholder='e.g. 5'
								required
							/>
							<FormDatePicker
								control={form.control}
								name='applicationDeadline'
								label='Application Deadline'
								required
							/>
						</div>
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
