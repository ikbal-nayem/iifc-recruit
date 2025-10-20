'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { IClientOrganization } from '@/interfaces/master-data.interface';

interface ExaminerSetupProps {
	examiners: IClientOrganization[];
	selectedExaminer: string | undefined;
	onExaminerChange: (id: string | undefined) => void;
}

export function ExaminerSetup({ examiners, selectedExaminer, onExaminerChange }: ExaminerSetupProps) {
	return (
		<Card className='glassmorphism'>
			<CardHeader>
				<CardTitle>Assign Examiner</CardTitle>
			</CardHeader>
			<CardContent>
				<FormAutocomplete
					control={undefined as any}
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
			</CardContent>
		</Card>
	);
}
