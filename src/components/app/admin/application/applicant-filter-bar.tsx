
'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const filterSchema = z.object({
	gender: z.string().optional(),
	status: z.string().optional(),
	minAge: z.coerce.number().optional(),
	maxAge: z.coerce.number().optional(),
	minMarks: z.coerce.number().optional(),
	maxMarks: z.coerce.number().optional(),
	interviewDate: z.string().optional(),
});

export type ApplicantFilterValues = z.infer<typeof filterSchema>;

interface ApplicantFilterBarProps {
	onFilterChange: (filters: ApplicantFilterValues) => void;
	isProcessing?: boolean;
	statuses: EnumDTO[];
}

export function ApplicantFilterBar({ onFilterChange, isProcessing, statuses }: ApplicantFilterBarProps) {
	const [genders, setGenders] = useState<EnumDTO[]>([]);

	const form = useForm<ApplicantFilterValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			gender: '',
			status: '',
			minAge: undefined,
			maxAge: undefined,
			minMarks: undefined,
			maxMarks: undefined,
			interviewDate: '',
		},
	});

	useEffect(() => {
		MasterDataService.getEnum('gender').then((res) => setGenders(res.body as EnumDTO[]));
	}, []);

	const { watch, handleSubmit, reset } = form;
	const watchedFilters = watch();

	const handleReset = () => {
		reset();
		onFilterChange({});
	};

	const hasActiveFilters = Object.values(watchedFilters).some((v) => v);

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onFilterChange)} className='space-y-4 p-4 border rounded-lg glassmorphism'>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-end'>
					<FormSelect
						name='status'
						control={form.control}
						label='Status'
						placeholder='Filter by status'
						options={[{ value: 'all', nameEn: 'All Statuses' }, ...statuses]}
						getOptionValue={(op) => op.value}
						getOptionLabel={(op) => op.nameEn}
						allowClear
					/>
					<FormSelect
						name='gender'
						control={form.control}
						label='Gender'
						placeholder='Filter by gender'
						options={genders}
						getOptionValue={(op) => op.value}
						getOptionLabel={(op) => op.nameEn}
						allowClear
					/>
					<div className='flex gap-2'>
						<FormInput control={form.control} name='minAge' label='Min Age' type='number' placeholder='e.g. 25' />
						<FormInput control={form.control} name='maxAge' label='Max Age' type='number' placeholder='e.g. 35' />
					</div>
					<div className='flex gap-2'>
						<FormInput
							control={form.control}
							name='minMarks'
							label='Min Marks'
							type='number'
							placeholder='e.g. 60'
						/>
						<FormInput
							control={form.control}
							name='maxMarks'
							label='Max Marks'
							type='number'
							placeholder='e.g. 90'
						/>
					</div>
					{isProcessing && (
						<FormDatePicker control={form.control} name='interviewDate' label='Interview Date' />
					)}
				</div>
				<div className='flex items-center justify-end gap-2'>
					{hasActiveFilters && (
						<Button type='button' variant='ghost' onClick={handleReset}>
							<X className='mr-2 h-4 w-4' />
							Reset
						</Button>
					)}
					<Button type='submit'>
						<Search className='mr-2 h-4 w-4' />
						Apply Filters
					</Button>
				</div>
			</form>
		</Form>
	);
}
