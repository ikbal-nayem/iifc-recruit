'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { RequestedPost } from '@/interfaces/job.interface';
import { Jobseeker } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, FileText, Loader2, Search, UserPlus } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { JobseekerProfileView } from '../../jobseeker/jobseeker-profile-view';

// Mock data - replace with API calls
const allJobseekers: Jobseeker[] = [
	{ id: '1', personalInfo: { name: 'Alice Johnson', email: 'alice@example.com' } },
	{ id: '2', personalInfo: { name: 'Bob Smith', email: 'bob@example.com' } },
	{ id: '3', personalInfo: { name: 'Charlie Brown', email: 'charlie@example.com' } },
	{ id: '4', personalInfo: { name: 'Diana Prince', email: 'diana@example.com' } },
] as Jobseeker[];

interface ApplicantManagementProps {
	post: RequestedPost;
}

export function ApplicantManagement({ post }: ApplicantManagementProps) {
	const { toast } = useToast();
	const [primaryList, setPrimaryList] = useState<Jobseeker[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [suggestedJobseekers, setSuggestedJobseekers] = useState<Jobseeker[]>([]);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [selectedJobseeker, setSelectedJobseeker] = React.useState<Jobseeker | null>(null);

	const debouncedSearch = useDebounce(searchQuery, 300);

	React.useEffect(() => {
		if (debouncedSearch) {
			setIsLoading(true);
			// Simulate API call
			setTimeout(() => {
				setSuggestedJobseekers(
					allJobseekers.filter(
						(js) =>
							js.personalInfo.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
							!primaryList.some((p) => p.id === js.id)
					)
				);
				setIsLoading(false);
			}, 500);
		} else {
			setSuggestedJobseekers([]);
		}
	}, [debouncedSearch, primaryList]);

	const handleAddApplicant = (jobseeker: Jobseeker) => {
		setPrimaryList((prev) => [...prev, jobseeker]);
		setPopoverOpen(false);
		setSearchQuery('');
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
		<div className='space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Manage Applicants for: {post.post?.nameEn}</CardTitle>
					<CardDescription>
						{post.jobRequest?.clientOrganization?.nameEn} | Vacancies: {post.vacancy}
					</CardDescription>
				</CardHeader>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Add to Primary List</CardTitle>
					<CardDescription>Search for and add jobseekers to the primary list for this post.</CardDescription>
				</CardHeader>
				<CardContent>
					<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
						<PopoverTrigger asChild>
							<Button variant='outline' className='w-full justify-start'>
								<UserPlus className='mr-2 h-4 w-4' />
								Search Jobseekers...
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
							<Command>
								<CommandInput
									placeholder='Search by name or email...'
									value={searchQuery}
									onValueChange={setSearchQuery}
								/>
								<CommandList>
									{isLoading ? (
										<div className='p-2 flex justify-center'>
											<Loader2 className='h-6 w-6 animate-spin' />
										</div>
									) : (
										<>
											<CommandEmpty>No jobseekers found.</CommandEmpty>
											<CommandGroup>
												{suggestedJobseekers.map((js) => (
													<CommandItem
														key={js.id}
														value={js.personalInfo.name}
														onSelect={() => handleAddApplicant(js)}
													>
														{js.personalInfo.name}
														<span className='ml-2 text-xs text-muted-foreground'>
															({js.personalInfo.email})
														</span>
													</CommandItem>
												))}
											</CommandGroup>
										</>
									)}
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</CardContent>
			</Card>

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
			</Card>
			<Dialog open={!!selectedJobseeker} onOpenChange={(isOpen) => !isOpen && setSelectedJobseeker(null)}>
				<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
					{selectedJobseeker && <JobseekerProfileView jobseeker={selectedJobseeker} />}
				</DialogContent>
			</Dialog>
		</div>
	);
}
