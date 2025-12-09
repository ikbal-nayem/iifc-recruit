
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
import { FormMultiSelect } from '@/components/ui/form-multi-select';
import { FormSelect } from '@/components/ui/form-select';
import { useDebounce } from '@/hooks/use-debounce';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import {
	getOutsourcingCategoriesAsync,
	getPostOutsourcingAsync,
	getSkillsAsync,
} from '@/services/async-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const filterSchema = z.object({
	gender: z.string().optional(),
	organizationId: z.string().optional(),
	religion: z.string().optional(),
	permanentDivisionId: z.string().optional(),
	permanentDistrictId: z.string().optional(),
	maritalStatus: z.string().optional(),
	profileCompletion: z.coerce.number().optional(),
	minAge: z.coerce.number().optional(),
	maxAge: z.coerce.number().optional(),
	postId: z.string().optional(),
	outsourcingCategoryId: z.string().optional(),
	skillIds: z.array(z.string()).optional(),
	degreeLevelId: z.string().optional(),
	minExp: z.coerce.number().optional(),
});

export type FilterFormValues = z.infer<typeof filterSchema>;

interface ApplicantFiltersProps {
	onFilterChange: (filters: Partial<FilterFormValues>) => void;
}

export function ApplicantFilters({ onFilterChange }: ApplicantFiltersProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [masterData, setMasterData] = useState({
		genders: [],
		religions: [],
		maritalStatuses: [],
		divisions: [],
		degreeLevels: [],
	});

	const form = useForm<FilterFormValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			gender: '',
			organizationId: '',
			religion: '',
			permanentDivisionId: '',
			permanentDistrictId: '',
			maritalStatus: '',
			profileCompletion: undefined,
			minAge: undefined,
			maxAge: undefined,
			postId: '',
			outsourcingCategoryId: '',
			skillIds: [],
			degreeLevelId: '',
			minExp: undefined,
		},
	});

	const watchedFilters = form.watch();
	const debouncedFilters = useDebounce(watchedFilters, 500);

	useEffect(() => {
		onFilterChange(debouncedFilters);
	}, [debouncedFilters, onFilterChange]);

	useEffect(() => {
		async function loadMaster() {
			const [genderRes, religionRes, maritalStatusRes, divisionRes, degreeLevelRes] = await Promise.allSettled([
				MasterDataService.getEnum('gender'),
				MasterDataService.getEnum('religion'),
				MasterDataService.getEnum('marital-status'),
				MasterDataService.country.getDivisions(),
				MasterDataService.degreeLevel.get(),
			]);

			setMasterData({
				genders: genderRes.status === 'fulfilled' ? genderRes.value.body : [],
				religions: religionRes.status === 'fulfilled' ? religionRes.value.body : [],
				maritalStatuses: maritalStatusRes.status === 'fulfilled' ? maritalStatusRes.value.body : [],
				divisions: divisionRes.status === 'fulfilled' ? divisionRes.value.body : [],
				degreeLevels: degreeLevelRes.status === 'fulfilled' ? degreeLevelRes.value.body : [],
			});
		}
		loadMaster();
	}, []);

	const handleReset = () => {
		form.reset();
		onFilterChange({});
	};

	const activeFilterCount = Object.values(watchedFilters).filter(
		(v) => v !== '' && v !== undefined && (!Array.isArray(v) || v.length > 0)
	).length;

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<div className='flex items-center justify-between'>
				<CollapsibleTrigger asChild>
					<Button variant='outline'>
						<SlidersHorizontal className='mr-2 h-4 w-4' />
						Filters
						{activeFilterCount > 0 && (
							<span className='ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
								{activeFilterCount}
							</span>
						)}
					</Button>
				</CollapsibleTrigger>
				{activeFilterCount > 0 && (
					<Button variant='ghost' onClick={handleReset}>
						<X className='mr-2 h-4 w-4' />
						Reset Filters
					</Button>
				)}
			</div>
			<CollapsibleContent className='mt-4'>
				<Card className='p-4 border-2 border-dashed glassmorphism'>
					<CardContent className='p-0'>
						<Form {...form}>
							<form className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
									<FormAutocomplete
										name='outsourcingCategoryId'
										control={form.control}
										label='Outsourcing Category'
										placeholder='Select category...'
										loadOptions={getOutsourcingCategoriesAsync}
										getOptionValue={(option) => option.id}
										getOptionLabel={(option) => option.nameBn}
										allowClear
										onValueChange={() => form.setValue('postId', '')}
									/>
									<FormAutocomplete
										name='postId'
										control={form.control}
										label='Post'
										placeholder='Select post...'
										disabled={!watchedFilters.outsourcingCategoryId}
										loadOptions={(search, callback) =>
											getPostOutsourcingAsync(search, callback, watchedFilters.outsourcingCategoryId)
										}
										getOptionValue={(option) => option.id}
										getOptionLabel={(option) => option.nameBn}
										allowClear
									/>
									<FormAutocomplete
										name='degreeLevelId'
										control={form.control}
										label='Degree Level'
										placeholder='Select degree level...'
										options={masterData.degreeLevels}
										getOptionValue={(option) => option.id}
										getOptionLabel={(option) => option.nameEn}
										allowClear
									/>
									<FormInput
										control={form.control}
										name='minExp'
										label='Minimum Experience (Yrs)'
										type='number'
										placeholder='e.g., 5'
									/>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
									<FormSelect
										name='gender'
										control={form.control}
										label='Gender'
										placeholder='Filter by gender'
										options={masterData.genders}
										getOptionValue={(o) => o.value}
										getOptionLabel={(o) => o.nameEn}
										allowClear
									/>
									<FormSelect
										name='religion'
										control={form.control}
										label='Religion'
										placeholder='Filter by religion'
										options={masterData.religions}
										getOptionValue={(o) => o.value}
										getOptionLabel={(o) => o.nameEn}
										allowClear
									/>
									<FormSelect
										name='maritalStatus'
										control={form.control}
										label='Marital Status'
										placeholder='Filter by marital status'
										options={masterData.maritalStatuses}
										getOptionValue={(o) => o.value}
										getOptionLabel={(o) => o.nameEn}
										allowClear
									/>
								</div>
								
								<div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
									<div className='flex gap-2'>
										<FormInput control={form.control} name='minAge' label='Min Age' type='number' />
										<FormInput control={form.control} name='maxAge' label='Max Age' type='number' />
									</div>
									<FormInput
										control={form.control}
										name='profileCompletion'
										label='Profile Completion >'
										type='number'
										placeholder='e.g., 75'
									/>
								</div>

								<FormMultiSelect
									name='skillIds'
									control={form.control}
									label='Required Skills'
									placeholder='Filter by skills...'
									loadOptions={getSkillsAsync}
									getOptionValue={(option) => option.id}
									getOptionLabel={(option) => option.nameEn}
								/>
							</form>
						</Form>
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
}
