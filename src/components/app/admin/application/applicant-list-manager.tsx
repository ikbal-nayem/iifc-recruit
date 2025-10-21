
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
import { FormInput } from '@/components/ui/form-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { Jobseeker } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, FileText, Loader2, Search, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';

const searchSchema = z.object({
	searchKey: z.string().optional(),
	experience: z.coerce.number().optional(),
	skillIds: z.array(z.number()).optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

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
	const [popoverOpen, setPopoverOpen] = useState(false);

	const form = useForm<SearchFormValues>({
		resolver: zodResolver(searchSchema),
		defaultValues: {
			searchKey: '',
			skillIds: [],
			experience: undefined,
		},
	});

	const searchKey = form.watch('searchKey');
	const debouncedSearchKey = useDebounce(searchKey, 500);

	const onSearchSubmit = useCallback(
		async (values: SearchFormValues) => {
			setIsLoading(true);
			try {
				const response = await JobseekerProfileService.search({ body: values });
				const filteredResults =
					response.body?.filter((js) => !primaryList.some((p) => p.id === js.id)) || [];
				setSuggestedJobseekers(filteredResults);
			} catch (error: any) {
				toast({
					title: 'Search Failed',
					description: error.message || 'Could not fetch jobseekers.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[primaryList, toast]
	);

	useEffect(() => {
		// Auto-search only on debounced text input change
		onSearchSubmit(form.getValues());
	}, [debouncedSearchKey, onSearchSubmit, form]);

	const handleFilterSubmit = () => {
		onSearchSubmit(form.getValues());
	};

	const fetchSkills = useCallback(
		async (query: string) => {
			setIsSkillLoading(true);
			try {
				const response = await MasterDataService.skill.getList({
					body: { name: query },
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

	const handleSkillSelect = (skill: ICommonMasterData) => {
		if (skill && !selectedSkills.some((s) => s.id === skill.id)) {
			const newSelectedSkills = [...selectedSkills, skill];
			setSelectedSkills(newSelectedSkills);
			form.setValue(
				'skillIds',
				newSelectedSkills.map((s) => s.id!)
			);
		}
		setSkillSearchQuery('');
	};

	const handleSkillRemove = (skillToRemove: ICommonMasterData) => {
		const newSelectedSkills = selectedSkills.filter((s) => s.id !== skillToRemove.id);
		setSelectedSkills(newSelectedSkills);
		form.setValue(
			'skillIds',
			newSelectedSkills.map((s) => s.id!)
		);
	};

	const handleAddApplicant = (jobseeker: Jobseeker) => {
		setPrimaryList((prev) => [...prev, jobseeker]);
		setSuggestedJobseekers((prev) => prev.filter((js) => js.id !== jobseeker.id));
		toast({
			title: 'Applicant Added',
			description: `${jobseeker.personalInfo?.fullName} has been added to the primary list.`,
			variant: 'success',
		});
	};

	const handleRemoveApplicant = (jobseekerId: string) => {
		setPrimaryList((prev) => prev.filter((js) => js.id !== jobseekerId));
	};

	return (
		<>
			<div className='space-y-4'>
				<FormProvider {...form}>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleFilterSubmit();
						}}
						className='space-y-4'
					>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 items-end'>
							<div>
								<label className='text-sm font-medium'>Skills</label>
								<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
									<PopoverTrigger asChild>
										<div
											className={cn(
												'flex flex-wrap gap-1 p-2 mt-2 border rounded-lg min-h-[44px] items-center cursor-text w-full justify-start font-normal h-auto bg-background'
											)}
										>
											{selectedSkills.length === 0 && (
												<span className='text-sm text-muted-foreground px-1'>Filter by skills...</span>
											)}
											{selectedSkills.map((skill) => (
												<Badge key={skill.id} variant='secondary' className='text-sm py-1 px-2'>
													{skill.name}
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
									</PopoverTrigger>
									<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
										<Command>
											<CommandInput
												placeholder='Search skill...'
												value={skillSearchQuery}
												onValueChange={setSkillSearchQuery}
											/>
											<CommandList>
												{isSkillLoading && <CommandEmpty>Loading...</CommandEmpty>}
												{!isSkillLoading && <CommandEmpty>No skill found.</CommandEmpty>}
												<CommandGroup>
													{availableSkills.map((skill) => (
														<CommandItem
															key={skill.id}
															value={skill.name}
															onSelect={() => {
																handleSkillSelect(skill);
																setPopoverOpen(false);
															}}
														>
															<Check
																className={cn(
																	'mr-2 h-4 w-4',
																	selectedSkills.some((s) => s.id === skill.id)
																		? 'opacity-100'
																		: 'opacity-0'
																)}
															/>
															{skill.name}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>
							<FormInput
								control={form.control}
								name='experience'
								label='Min. Experience (Yrs)'
								type='number'
								placeholder='e.g., 5'
							/>
						</div>
						<FormInput
							control={form.control}
							name='searchKey'
							label='Search by Name/Email/Phone'
							placeholder='e.g. John Doe, john@example.com...'
							startIcon={<Search className='h-4 w-4 text-muted-foreground' />}
						/>
						<Button type='submit' size='sm'>
							<Search className='mr-2 h-4 w-4' />
							Apply Filters
						</Button>
					</form>
				</FormProvider>

				<div className='max-h-64 overflow-y-auto space-y-2'>
					{isLoading ? (
						<div className='p-2 flex justify-center'>
							<Loader2 className='h-6 w-6 animate-spin' />
						</div>
					) : (
						<>
							{suggestedJobseekers.length === 0 ? (
								<p className='text-center text-sm text-muted-foreground py-4'>
									No jobseekers found for the selected criteria.
								</p>
							) : (
								suggestedJobseekers.map((js, index) => (
									<Card
										key={js.id || index}
										className='p-3 flex items-center justify-between hover:bg-muted transition-colors'
									>
										<div className='flex items-center gap-3'>
											<Avatar>
												<AvatarImage src={js.personalInfo?.profileImage?.filePath} />
												<AvatarFallback>{js.personalInfo?.fullName?.[0]}</AvatarFallback>
											</Avatar>
											<div>
												<p className='font-semibold'>{js.personalInfo?.fullName}</p>
												<p className='text-xs text-muted-foreground'>{js.personalInfo?.email}</p>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<Button
												variant='ghost'
												size='sm'
												onClick={() => setSelectedJobseeker(js)}
												className='h-8'
											>
												<FileText className='mr-2 h-4 w-4' /> View
											</Button>
											<Button size='sm' onClick={() => handleAddApplicant(js)} className='h-8'>
												Add
											</Button>
										</div>
									</Card>
								))
							)}
						</>
					)}
				</div>

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
											<AvatarImage src={js.personalInfo?.profileImage?.filePath} />
											<AvatarFallback>{js.personalInfo?.fullName?.[0]}</AvatarFallback>
										</Avatar>
										<div>
											<p className='font-semibold'>{js.personalInfo?.fullName}</p>
											<p className='text-sm text-muted-foreground'>{js.personalInfo?.email}</p>
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
