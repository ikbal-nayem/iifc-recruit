'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const outsourcingSchema = z.object({
	categoryId: z.string().min(1, 'Category is required.'),
	service: z.string().min(1, 'Service is required.'),
});

type OutsourcingFormValues = z.infer<typeof outsourcingSchema>;

interface ProfileFormOutsourcingProps {
	categories: ICommonMasterData[];
}

export function ProfileFormOutsourcing({ categories }: ProfileFormOutsourcingProps) {
	const form = useForm<OutsourcingFormValues>({
		resolver: zodResolver(outsourcingSchema),
		defaultValues: {
			categoryId: '',
			service: '',
		},
	});

	const onSubmit = (data: OutsourcingFormValues) => {
		console.log('Outsourcing data submitted:', data);
		// Here you would typically call an API to save the data
	};

	return (
		<div className='space-y-6'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>Outsourcing Information</CardTitle>
							<CardDescription>
								Please provide your outsourcing category and service details.
							</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<FormAutocomplete
								control={form.control}
								name='categoryId'
								label='Category'
								placeholder='Select a category'
								required
								options={categories}
								getOptionValue={(option) => option.id}
								getOptionLabel={(option) => option.nameEn}
							/>
							<FormInput
								control={form.control}
								name='service'
								label='Service'
								placeholder='Enter your service details'
								required
							/>
						</CardContent>
					</Card>
					<div className='flex justify-center pt-6'>
						<Button type='submit'>
							<Save className='mr-2 h-4 w-4' />
							Save Outsourcing Info
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
