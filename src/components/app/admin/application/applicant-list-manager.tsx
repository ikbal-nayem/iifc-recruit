
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Form, FormProvider } from 'react-hook-form';
import { FormInput } from '@/components/ui/form-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { Jobseeker } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { makePreviewURL } from '@/lib/file-oparations';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, FileText, Filter, Loader2, Search, UserPlus, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';
import { Input } from '@/components/ui/input';

const filterSchema = z.object({
	skillIds: z.array(z.number()).optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface ApplicantListManagerProps {
	onApply: (applicants: Jobseeker[]) => void;
	existingApplicantIds: (string | undefined)[];
}

export function ApplicantListManager({ onApply, existingApplicantIds }: ApplicantListManagerProps) {
	const { toast } = useToast();
	const [primaryList, setPrimaryList] = useState<Jobseeker[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [suggestedJobseekers, setSuggestedJobseekers] = useState<Jobseeker[]>([]);
	const [selectedJobseeker, setSelectedJobseeker] = React.useState<Jobseeker | null>(null);
	const [textSearch, setTextSearch] = useState('');
	const debouncedTextSearch = useDebounce(textSearch, 500);

	const [isSkillLoading, setIsSkillLoading] = useState(false);
	const [skillSearchQuery, setSkillSearchQuery] = useState('');
	const debouncedSkillSearch = useDebounce(skillSearchQuery, 300);
	const [availableSkills, setAvailableSkills] = useState<ICommonMasterData[]>([]);
	const [selectedSkills, setSelectedSkills] = useState<ICommonMasterData[]>([]);
	const [popoverOpen, setPopoverOpen] = useState(false);

	const filterForm = useForm<FilterFormValues>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			skillIds: [],
		},
	});

	const searchApplicants = useCallback(
		async (searchCriteria: { searchKey?: string; skillIds?: number[] }) => {
			setIsLoading(true);
			try {
				const response = await JobseekerProfileService.search({ body: searchCriteria });
				const newSuggestions = (response.body || []).filter(
					(js) => !primaryList.some((p) => p.id === js.id) && !existingApplicantIds.includes(js.id)
				);
				setSuggestedJobseekers(newSuggestions);
			} catch (error: any) {
				toast({
					title: 'Search Failed',
					description: error.message || 'Could not fetch jobseekers.',
					variant: 'danger',
				});
				setSuggestedJobseekers([]);
			} finally {
				setIsLoading(false);
			}
		},
		[primaryList, toast, existingApplicantIds]
	);

	useEffect(() => {
		searchApplicants({ searchKey: debouncedTextSearch });
	}, [debouncedTextSearch, searchApplicants]);

	const onFilterSubmit = (values: FilterFormValues) => {
		searchApplicants({
			searchKey: textSearch,
			...values,
		});
	};

	const fetchSkills = useCallback(
		async (query: string) => {
			setIsSkillLoading(true);
			try {
				const response = await MasterDataService.skill.getList({
					body: { searchKey: query },
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
			filterForm.setValue(
				'skillIds',
				newSelectedSkills.map((s) => s.id!)
			);
		}
		setSkillSearchQuery('');
		setPopoverOpen(false);
	};

	const handleSkillRemove = (skillToRemove: ICommonMasterData) => {
		const newSelectedSkills = selectedSkills.filter((s) => s.id !== skillToRemove.id);
		setSelectedSkills(newSelectedSkills);
		filterForm.setValue(
			'skillIds',
			newSelectedSkills.map((s) => s.id!)
		);
	};

	const handleAddApplicant = (jobseeker: Jobseeker) => {
		setPrimaryList((prev) => [...prev, jobseeker]);
		setSuggestedJobseekers((prev) => prev.filter((js) => js.id !== jobseeker.id));
	};

	const handleRemoveApplicant = (jobseekerId: string) => {
		const removedApplicant = primaryList.find((js) => js.id === jobseekerId);
		setPrimaryList((prev) => prev.filter((js) => js.id !== jobseekerId));
		if (removedApplicant) {
			setSuggestedJobseekers((prev) => [removedApplicant, ...prev]);
		}
	};

	return (
		<>
			<FormProvider {...filterForm}>
				<form onSubmit={filterForm.handleSubmit(onFilterSubmit)} className='space-y-4'>
					<div className='p-4 border rounded-lg bg-muted/50 space-y-4'>
						<div>
							<label className='text-sm font-medium'>Skills</label>
							<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
								<PopoverTrigger asChild>
									<div
										className={cn(
											'flex flex-wrap gap-1 p-2 mt-2 border rounded-lg min-h-[44px] items-center cursor-text w-full justify-start font-normal h-auto bg-background'
										)}
									>
										{selectedSkills.length > 0 ? (
											selectedSkills.map((skill) => (
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
											))
										) : (
											<span className='text-sm text-muted-foreground px-1'>Filter by skills...</span>
										)}
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
														value={skill.nameEn}
														onSelect={() => handleSkillSelect(skill)}
													>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																selectedSkills.some((s) => s.id === skill.id)
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														{skill.nameEn}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
						</div>
						<Button type='submit'>
							<Filter className='mr-2 h-4 w-4' /> Filter
						</Button>
					</div>
					<div className='relative w-full'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Filter results by name, email, or phone...'
							value={textSearch}
							onChange={(e) => setTextSearch(e.target.value)}
							className='pl-10 h-11'
						/>
					</div>
				</form>
			</FormProvider>

			<Card>
				<CardHeader>
					<CardTitle>Search Results</CardTitle>
					<CardDescription>Select jobseekers to add them to the primary list below.</CardDescription>
				</CardHeader>
				<CardContent className='max-h-64 overflow-y-auto space-y-2'>
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
												<AvatarImage src={makePreviewURL(js.profileImage)} />
												<AvatarFallback>
													{js.firstName?.[0]}
													{js.lastName?.[0]}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className='font-semibold'>{js.fullName}</p>
												<div className='text-xs text-muted-foreground'>
													<p>{js.email}</p>
													<p>{js.phone}</p>
												</div>
											</div>
										</div>
										<div className='flex items-center gap-2'>
											<Button variant='ghost' size='sm' onClick={() => setSelectedJobseeker(js)} className='h-8'>
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
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Primary List ({primaryList.length})</CardTitle>
					<CardDescription>These candidates will be considered for the next steps.</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					{primaryList.length > 0 ? (
						primaryList.map((js) => (
							<Card key={js.id} className='p-4 flex items-center justify-between'>
								<div className='flex items-center gap-4'>
									<Avatar>
										<AvatarImage src={makePreviewURL(js.profileImage)} />
										<AvatarFallback>
											{js.firstName?.[0]}
											{js.lastName?.[0]}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-semibold'>{js.fullName}</p>
										<div className='text-sm text-muted-foreground'>
											<p>{js.email}</p>
											<p>{js.phone}</p>
										</div>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<Button variant='ghost' size='sm' onClick={() => setSelectedJobseeker(js)}>
										<FileText className='mr-2 h-4 w-4' /> View
									</Button>
									<Button variant='destructive' size='sm' onClick={() => handleRemoveApplicant(js.id!)}>
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
				{primaryList.length > 0 && (
					<CardFooter>
						<Button onClick={() => onApply(primaryList)}>
							<UserPlus className='mr-2 h-4 w-4' />
							Apply ({primaryList.length}) Candidates
						</Button>
					</CardFooter>
				)}
			</Card>
			<Dialog open={!!selectedJobseeker} onOpenChange={(isOpen) => !isOpen && setSelectedJobseeker(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					{selectedJobseeker && <JobseekerProfileView jobseeker={selectedJobseeker} />}
				</DialogContent>
			</Dialog>
		</>
	);
}
