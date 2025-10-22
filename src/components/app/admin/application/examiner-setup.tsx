'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../ui/button';
import { Loader2, Save } from 'lucide-react';
import { useEffect } from 'react';

const formSchema = z.object({
	examinerId: z.coerce.number().min(1, 'Please select an examiner.'),
});

type ExaminerFormValues = z.infer<typeof formSchema>;

interface ExaminerSetupProps {
	examiners: IClientOrganization[];
	selectedExaminer: number | undefined;
	onSave: (examinerId: number) => Promise<boolean>;
	isSaving: boolean;
}

export function ExaminerSetup({ examiners, selectedExaminer, onSave, isSaving }: ExaminerSetupProps) {
	const form = useForm<ExaminerFormValues>({
		resolver: zodResolver(formSchema),
		values: {
			examinerId: selectedExaminer,
		},
	});

	useEffect(() => {
		form.reset({ examinerId: selectedExaminer });
	}, [selectedExaminer, form]);

	const handleFormSubmit = (data: ExaminerFormValues) => {
		onSave(data.examinerId);
	};

	return (
		<Card className='glassmorphism'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleFormSubmit)}>
					<CardHeader>
						<CardTitle>Assign Examiner</CardTitle>
						<CardDescription>Select an organization to conduct the examination for this post.</CardDescription>
					</CardHeader>
					<CardContent>
						<FormAutocomplete
							control={form.control}
							name='examinerId'
							label='Select an Examiner'
							required
							placeholder='Search for an examining organization...'
							options={examiners}
							getOptionValue={(option) => option.id!.toString()}
							getOptionLabel={(option) => option.nameEn}
						/>
					</CardContent>
					<CardFooter>
						<Button type='submit' disabled={isSaving}>
							{isSaving ? (
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							) : (
								<Save className='mr-2 h-4 w-4' />
							)}
							Save Examiner
						</Button>
					</CardFooter>
				</form>
			</Form>
		</Card>
	);
}
