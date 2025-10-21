
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';
import { Jobseeker } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { MasterDataService } from '@/services/api/master-data.service';
import { FormAutocomplete } from '@/components/ui/form-autocomplete';

const allJobseekers: Jobseeker[] = [
	{ id: '1', personalInfo: { name: 'Alice Johnson', email: 'alice@example.com' } },
	{ id: '2', personalInfo: { name: 'Bob Smith', email: 'bob@example.com' } },
	{ id: '3', personalInfo: { name: 'Charlie Brown', email: 'charlie@example.com' } },
	{ id: '4', personalInfo: { name: 'Diana Prince', email: 'diana@example.com' } },
] as Jobseeker[];

const searchSchema = {
	search: '',
	skillId: null,
	experience: null,
};

export function ApplicantListManager() {
	const { toast } = useToast();
	const [primaryList, setPrimaryList] = useState<Jobseeker[]>([]);
	const [skills, setSkills] = useState<ICommonMasterData[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [suggestedJobseekers, setSuggestedJobseekers] = useState<Jobseeker[]>([]);
	const [selectedJobseeker, setSelectedJobseeker] = React.useState<Jobseeker | null>(null);

	const form = useForm({
		defaultValues: searchSchema,
	});

	const search = form.watch('search');
	const debouncedSearch = useDebounce(search, 300);

	useEffect(() => {
		async function fetchSkills() {
			try {
				const response = await MasterDataService.skill.get();
				setSkills(response.body);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Could not load skills for filtering.',
					variant: 'danger',
				});
			}
		}
		fetchSkills();
	}, [toast]);

	const onSearchSubmit = (values: any) => {
		setIsLoading(true);
		console.log('Searching with filters:', values);
		// Simulate API call with filters
		setTimeout(() => {
			let filtered = allJobseekers;

			if (values.search) {
				filtered = filtered.filter(
					(js) =>
						js.personalInfo.name.toLowerCase().includes(values.search.toLowerCase()) &&
						!primaryList.some((p) => p.id === js.id)
				);
			}
			// In a real scenario, you'd also filter by skill and experience on the backend
			setSuggestedJobseekers(filtered);
			setIsLoading(false);
		}, 500);
	};

	React.useEffect(() => {
		// This handles the simple name search for now
		onSearchSubmit({ search: debouncedSearch });
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
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end'>
							<FormInput
								control={form.control}
								name='search'
								label='Search by Name'
								placeholder='e.g., John Doe'
							/>
							<FormAutocomplete
								control={form.control}
								name='skillId'
								label='Skill'
								placeholder='Filter by skill...'
								options={skills}
								getOptionValue={(opt) => opt.id as number}
								getOptionLabel={(opt) => opt.name}
							/>
							<FormInput
								control={form.control}
								name='experience'
								label='Min. Experience (Yrs)'
								type='number'
								placeholder='e.g., 5'
							/>
						</div>
						<Button type='submit' size='sm'>
							<Search className='mr-2 h-4 w-4' /> Search
						</Button>
					</form>
				</Form>

				<Command>
					<CommandList className='max-h-64'>
						{isLoading ? (
							<div className='p-2 flex justify-center'>
								<Loader2 className='h-6 w-6 animate-spin' />
							</div>
						) : (
							<>
								{suggestedJobseekers.length === 0 && search && (
									<CommandEmpty>No jobseekers found.</CommandEmpty>
								)}
								<CommandGroup>
									{suggestedJobseekers.map((js) => (
										<CommandItem
											key={js.id}
											value={js.personalInfo.name}
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
