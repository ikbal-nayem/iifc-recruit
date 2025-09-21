
'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import type { Candidate } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MasterDataService } from '@/services/api/master-data.service';
import { Check, ChevronsUpDown, Loader2, Save, X } from 'lucide-react';
import * as React from 'react';

interface ProfileFormProps {
	candidate: Candidate;
}

export function ProfileFormSkills({ candidate }: ProfileFormProps) {
	const { toast } = useToast();
	const [skills, setSkills] = React.useState<string[]>(candidate.skills);

	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [suggestedSkills, setSuggestedSkills] = React.useState<ICommonMasterData[]>([]);
	const [isLoading, setIsLoading] = React.useState(false);

	const debouncedSearch = useDebounce(searchQuery, 300);

	React.useEffect(() => {
		if (debouncedSearch) {
			setIsLoading(true);
			MasterDataService.skill
				.getList({ body: { name: debouncedSearch }, meta: { page: 0, limit: 30 } })
				.then((res) => setSuggestedSkills(res.body))
				.finally(() => setIsLoading(false));
		} else {
			setSuggestedSkills([]);
		}
	}, [debouncedSearch]);

	const handleAddSkill = (skill: string) => {
		if (skill && !skills.includes(skill)) {
			setSkills([...skills, skill]);
		}
		setSearchQuery('');
		setSuggestedSkills([]);
		setOpen(false);
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setSkills(skills.filter((skill) => skill !== skillToRemove));
	};

	const handleSaveChanges = () => {
		// In a real app, you would save the skills to the backend here.
		toast({
			title: 'Skills Updated',
			description: 'Your skills have been successfully saved.',
			variant: 'success',
		});
	};

	return (
		<Card className='glassmorphism'>
			<CardHeader>
				<CardTitle>Skills</CardTitle>
				<CardDescription>
					Highlight your expertise. Add skills relevant to jobs you're interested in.
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='space-y-2'>
					<Label>Add a new skill</Label>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								aria-expanded={open}
								className='w-full justify-between'
							>
								Type to search skills...
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
							<Command>
								<CommandInput
									placeholder='Search for a skill...'
									value={searchQuery}
									onValueChange={setSearchQuery}
								/>
								<CommandList>
									{isLoading && (
										<div className='p-2 flex justify-center'>
											<Loader2 className='h-6 w-6 animate-spin' />
										</div>
									)}
									{!isLoading && <CommandEmpty>No skill found. You can add it as a new skill.</CommandEmpty>}
									<CommandGroup>
										{suggestedSkills.map((skill) => (
											<CommandItem
												key={skill.id}
												value={skill.name}
												onSelect={(currentValue) => {
													handleAddSkill(currentValue);
												}}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														skills.includes(skill.name.toLowerCase()) ? 'opacity-100' : 'opacity-0'
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
				<div className='flex flex-wrap gap-2'>
					{skills.map((skill) => (
						<AlertDialog key={skill}>
							<Badge variant='secondary' className='text-sm py-1 px-3'>
								{skill}
								<AlertDialogTrigger asChild>
									<Button
										variant='ghost'
										size='icon'
										className='ml-1 h-4 w-4 text-secondary-foreground/70 hover:text-secondary-foreground'
									>
										<X className='h-3 w-3' />
									</Button>
								</AlertDialogTrigger>
							</Badge>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete the skill &quot;{skill}&quot;.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => handleRemoveSkill(skill)}
										className='bg-destructive hover:bg-destructive/90'
									>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					))}
				</div>
			</CardContent>
			<CardFooter>
				<Button onClick={handleSaveChanges}>
					<Save className='mr-2 h-4 w-4' />
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	);
}
