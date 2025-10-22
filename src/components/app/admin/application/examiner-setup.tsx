'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { IClientOrganization } from '@/interfaces/master-data.interface';
import { useForm } from 'react-hook-form';

interface ExaminerSetupProps {
	examiners: IClientOrganization[];
	selectedExaminer: string | undefined;
	onExaminerChange: (id: string | undefined) => void;
}

export function ExaminerSetup({ examiners, selectedExaminer, onExaminerChange }: ExaminerSetupProps) {
	const form = useForm();

	return (
		<Card className='glassmorphism'>
			<CardHeader>
				<CardTitle>Assign Examiner</CardTitle>
				<CardDescription>Select an organization to conduct the examination for this post.</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<FormAutocomplete
						control={form.control}
						name='examinerId'
						label='Select an Examiner'
						required
						placeholder='Search for an examining organization...'
						options={examiners}
						getOptionValue={(option) => option.id!.toString()}
						getOptionLabel={(option) => option.nameEn}
						value={selectedExaminer}
						onValueChange={(value) => onExaminerChange(value as string)}
					/>
				</Form>
			</CardContent>
		</Card>
	);
}
