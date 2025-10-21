
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';
import { FormInput } from '@/components/ui/form-input';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { Application } from '@/interfaces/application.interface';
import { Jobseeker } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, FileText, Loader2, Search, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';

type Applicant = Jobseeker & { application: Application };

const allJobseekers: Jobseeker[] = [
	{ id: '1', personalInfo: { name: 'Alice Johnson', email: 'alice@example.com' } },
	{ id: '2', personalInfo: { name: 'Bob Smith', email: 'bob@example.com' } },
	{ id: '3', personalInfo: { name: 'Charlie Brown', email: 'charlie@example.com' } },
	{ id: '4', personalInfo: { name: 'Diana Prince', email: 'diana@example.com' } },
] as Applicant[];

const searchSchema = z.object({
	search: z.string(),
	experience: z.coerce.number().optional(),
});

export function ApplicantListManager() {
	const { toast } = useToast();
	const [primaryList, setPrimaryList] = useState<Jobseeker[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [suggestedJobseekers, setSuggestedJobseekers] = useState<Jobseeker[]>([]);
	const [selectedJobseeker, setSelectedJobseeker] = React.useState<Jobseeker | null>(null);

	const [isSkillLoading, setIsSkillLoading] = useState(false);
	const [skillSearchQuery, setSkillSearchQuery] = useState('');
	const debouncedSkillSearch = useDebounce(skillSearchQuery, 300);
	const [availableSkills, setAvailableSkills] = useState<ICommonMasterData[]>([]);
	const [selectedSkills, setSelectedSkills] = useState<ICommonMasterData[]>([]);

	const form = useForm<z.infer<typeof searchSchema>>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			search: '',
			experience: undefined,
		},
	});

	const search = form.watch('search');
	const debouncedSearch = useDebounce(search, 300);

	const fetchSkills = useCallback(
		async (searchQuery: string) => {
			setIsSkillLoading(true);
			try {
				const response = await MasterDataService.skill.getList({
					body: { name: searchQuery },
					meta: { page: 0, limit: 20 },
				});
				setAvailableSkills(response.body);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Could not load skills for filtering.',
					variant: 'danger',
				});
			} finally {
				setIsSkillLoading(false);
			}
		},
		[toast]
	);

	useEffect(() => {
		fetchSkills(debouncedSkillSearch);
	}, [debouncedSkillSearch, fetchSkills]);

	const handleSkillSelect = (skillId: string) => {
		const skill = availableSkills.find((s) => s.id?.toString() === skillId);
		if (skill && !selectedSkills.some((s) => s.id === skill.id)) {
			const newSelectedSkills = [...selectedSkills, skill];
			setSelectedSkills(newSelectedSkills);
		}
	};

	const handleSkillRemove = (skillToRemove: ICommonMasterData) => {
		const newSelectedSkills = selectedSkills.filter((s) => s.id !== skillToRemove.id);
		setSelectedSkills(newSelectedSkills);
	};

	const onSearchSubmit = (values: z.infer<typeof searchSchema>) => {
		setIsLoading(true);
		const skillIds = selectedSkills.map((s) => s.id);
		console.log('Searching with filters:', { ...values, skillIds });
		// Simulate API call with filters
		setTimeout(() => {
			let filtered = allJobseekers;

			if (values.search) {
				filtered = filtered.filter(
					(js) =>
						(js.personalInfo.name.toLowerCase().includes(values.search.toLowerCase()) ||
							js.personalInfo.email?.toLowerCase().includes(values.search.toLowerCase())) &&
						!primaryList.some((p) => p.id === js.id)
				);
			}
			// In a real scenario, you'd also filter by skillIds and experience on the backend
			setSuggestedJobseekers(filtered);
			setIsLoading(false);
		}, 500);
	};

	React.useEffect(() => {
		onSearchSubmit({ ...form.getValues(), search: debouncedSearch });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch]);

	const handleAddApplicant = (jobseeker: Jobseeker) => {
		setPrimaryList((prev) => [...prev, jobseeker]);
		form.reset();
		setSuggestedJobseekers([]);
		toast({
			title: 'Applicant Added',
			description: `${jobseeker.personalInfo.name} has been added to the primary list.`,
			variant: 'success',
		});
	};

	const handleRemoveApplicant = (jobseekerId: string) => {
		setPrimaryList((prev) => prev.filter((js) => js.id !== jobseekerId));
	};

	return (
		<>
			<div className='space-y-4'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSearchSubmit)} className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
							<FormAutocomplete
								control={undefined as any}
								name='skillId'
								label='Skills'
								placeholder='Filter by skills...'
								options={availableSkills}
								getOptionLabel={(option) => option.nameEn}
								getOptionValue={(option) => option.id!.toString()}
								onValueChange={handleSkillSelect}
								onInputChange={setSkillSearchQuery}
								value={''} // Keep it empty to allow adding more
							/>
							<FormInput
								control={form.control}
								name='experience'
								label='Min. Experience (Yrs)'
								type='number'
								placeholder='e.g., 5'
							/>
						</div>
						{selectedSkills.length > 0 && (
							<div className='flex flex-wrap gap-2 p-2 border rounded-lg bg-muted/50'>
								{selectedSkills.map((skill) => (
									<Badge key={skill.id} variant='secondary' className='text-sm py-1 px-2'>
										{skill.nameEn}
										<button
											type='button'
											className='ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												handleSkillRemove(skill);
											}}
										>
											<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
										</button>
									</Badge>
								))}
							</div>
						)}
						<Button type='submit' size='sm'>
							<Search className='mr-2 h-4 w-4' /> Search
						</Button>
					</form>
				</Form>

				<Command>
					<CommandInput
						placeholder='Filter results by name, email, or phone...'
						value={form.watch('search')}
						onValueChange={(value) => form.setValue('search', value)}
					/>
					<CommandList className='max-h-64'>
						{isLoading ? (
							<div className='p-2 flex justify-center'>
								<Loader2 className='h-6 w-6 animate-spin' />
							</div>
						) : (
							<>
								{suggestedJobseekers.length === 0 && (
									<CommandEmpty>No jobseekers found for the selected criteria.</CommandEmpty>
								)}
								<CommandGroup>
									{suggestedJobseekers.map((js) => (
										<CommandItem
											key={js.id}
											value={`${js.personalInfo.name} ${js.personalInfo.email}`}
											onSelect={() => handleAddApplicant(js)}
											className='cursor-pointer'
										>
											{js.personalInfo.name}
											<span className='ml-2 text-xs text-muted-foreground'>({js.personalInfo.email})</span>
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>

				<Card>
					<CardHeader>
						<CardTitle>Primary List ({primaryList.length})</CardTitle>
						<CardDescription>
							These candidates will be considered for the next steps in the recruitment process.
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						{primaryList.length > 0 ? (
							primaryList.map((js) => (
								<Card key={js.id} className='p-4 flex items-center justify-between'>
									<div className='flex items-center gap-4'>
										<Avatar>
											<AvatarImage src={js.personalInfo.profileImage?.filePath} />
											<AvatarFallback>{js.personalInfo.name?.[0]}</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-semibold'>{js.personalInfo.name}</p>
											<p className='text-sm text-muted-foreground'>{js.personalInfo.email}</p>
										</div>
									</div>
									<div className='flex items-center gap-2'>
										<Button variant='ghost' size='sm' onClick={() => setSelectedJobseeker(js)}>
											<FileText className='mr-2 h-4 w-4' /> View
										</Button>
										<Button
											variant='destructive'
											size='sm'
											onClick={() => handleRemoveApplicant(js.id!)}
										>
											Remove
										</Button>
									</div>
								</Card>
							))
						) : (
							<div className='text-center py-10 text-muted-foreground'>
								No applicants have been added to the primary list yet.
							</div>
						)}
					</CardContent>
				</Card>
			</div>
			<Dialog open={!!selectedJobseeker} onOpenChange={(isOpen) => !isOpen && setSelectedJobseeker(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					{selectedJobseeker && <JobseekerProfileView jobseeker={selectedJobseeker} />}
				</DialogContent>
			</Dialog>
		</>
	);
}
