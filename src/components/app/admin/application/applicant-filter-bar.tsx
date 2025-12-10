
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormDatePicker } from '@/components/ui/form-datepicker';
import { FormInput } from '@/components/ui/form-input';
import { FormSelect } from '@/components/ui/form-select';
import { EnumDTO, ICommonMasterData, IEducationDegree } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const filterSchema = z.object({
	gender: z.string().optional(),
	minAge: z.coerce.number().optional(),
	maxAge: z.coerce.number().optional(),
	minMarks: z.coerce.number().optional(),
	maxMarks: z.coerce.number().optional(),
	interviewDate: z.string().optional(),
	degreeLevelId: z.string().optional(),
	degreeId: z.string().optional(),
});

export type ApplicantFilterValues = z.infer<typeof filterSchema>;

interface ApplicantFilterBarProps {
	onFilterChange: (filters: ApplicantFilterValues) => void;
	isProcessing?: boolean;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}

export function ApplicantFilterBar({
	onFilterChange,
	isProcessing,
	isOpen,
	onOpenChange,
}: ApplicantFilterBarProps) {
	const [genders, setGenders] = useState<EnumDTO[]>([]);
	const [degreeLevels, setDegreeLevels] = useState<ICommonMasterData[]>([]);
	const [degrees, setDegrees] = useState<IEducationDegree[]>([]);

	const form = useForm<ApplicantFilterValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			gender: '',
			minAge: undefined,
			maxAge: undefined,
			minMarks: undefined,
			maxMarks: undefined,
			interviewDate: '',
			degreeLevelId: '',
			degreeId: '',
		},
	});

	useEffect(() => {
		async function loadMasterData() {
			try {
				const [genderRes, levelRes, degreeRes] = await Promise.allSettled([
					MasterDataService.getEnum('gender'),
					MasterDataService.degreeLevel.get(),
					MasterDataService.educationDegree.get(),
				]);

				if (genderRes.status === 'fulfilled') setGenders(genderRes.value.body as EnumDTO[]);
				if (levelRes.status === 'fulfilled') setDegreeLevels(levelRes.value.body);
				if (degreeRes.status === 'fulfilled') setDegrees(degreeRes.value.body);
			} catch (error) {
				console.error('Failed to load filter master data:', error);
			}
		}
		loadMasterData();
	}, []);

	const { handleSubmit, reset } = form;
	const watchDegreeLevelId = form.watch('degreeLevelId');

	const filteredDegrees = React.useMemo(() => {
		if (!watchDegreeLevelId) return [];
		return degrees.filter((d) => d.degreeLevelId === watchDegreeLevelId);
	}, [watchDegreeLevelId, degrees]);

	const handleReset = () => {
		reset();
		onFilterChange({});
	};

	const handleFormSubmit = (data: ApplicantFilterValues) => {
		onFilterChange(data);
		onOpenChange(false);
	};

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent className='p-0 flex flex-col'>
				<SheetHeader className='p-6 pb-2'>
					<SheetTitle>Filter Applicants</SheetTitle>
					<SheetDescription>Refine the list of applicants using the filters below.</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form onSubmit={handleSubmit(handleFormSubmit)} className='flex-1 overflow-y-auto px-6'>
						<div className='space-y-4'>
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
							<FormAutocomplete
								name='degreeLevelId'
								control={form.control}
								label='Degree Level'
								placeholder='Filter by level'
								options={degreeLevels}
								getOptionLabel={(opt) => opt.nameEn}
								getOptionValue={(opt) => opt.id}
								allowClear
								onValueChange={() => form.setValue('degreeId', '')}
							/>
							<FormAutocomplete
								name='degreeId'
								control={form.control}
								label='Degree'
								placeholder='Filter by degree'
								options={filteredDegrees}
								getOptionLabel={(opt) => opt.nameEn}
								getOptionValue={(opt) => opt.id}
								disabled={!watchDegreeLevelId}
								allowClear
							/>
							{isProcessing && (
								<FormDatePicker control={form.control} name='interviewDate' label='Interview Date' />
							)}
						</div>
						<SheetFooter className='pt-6 sticky bottom-0 bg-white -mx-6 px-6 pb-6'>
							<Button type='button' variant='outline' onClick={handleReset}>
								Clear All Filters
							</Button>
							<Button type='submit'>Apply Filters</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
