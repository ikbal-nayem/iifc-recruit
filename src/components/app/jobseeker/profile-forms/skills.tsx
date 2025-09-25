
'use client';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { Check, Loader2, Save, X } from 'lucide-react';
import * as React from 'react';

interface SkillSelectorProps {
	selectedSkills: ICommonMasterData[];
	onAddSkill: (skill: ICommonMasterData) => void;
	onRemoveSkill: (skill: ICommonMasterData) => void;
}

const SkillSelector = React.memo(function SkillSelector({
	selectedSkills,
	onAddSkill,
	onRemoveSkill,
}: SkillSelectorProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [suggestedSkills, setSuggestedSkills] = React.useState<ICommonMasterData[]>([]);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);

	const debouncedSearch = useDebounce(searchQuery, 300);

	React.useEffect(() => {
		if (debouncedSearch) {
			setIsLoadingSuggestions(true);
			MasterDataService.skill
				.getList({ body: { name: debouncedSearch }, meta: { page: 0, limit: 30 } })
				.then((res) => setSuggestedSkills(res.body))
				.finally(() => setIsLoadingSuggestions(false));
		} else {
			setSuggestedSkills([]);
		}
	}, [debouncedSearch]);

	const handleSelectSkill = (skill: ICommonMasterData) => {
		if (!selectedSkills.some((s) => s.id === skill.id)) {
			onAddSkill(skill);
		}
		setSearchQuery('');
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			// Prevent adding a skill if the user just presses Enter on the input
			// without selecting an item from the list.
			const isSuggestionSelected = suggestedSkills.some(
				(skill) => skill.name.toLowerCase() === searchQuery.toLowerCase()
			);
			if (!isSuggestionSelected) {
				e.preventDefault();
			}
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div
					className={cn(
						'flex flex-wrap gap-2 p-3 border rounded-lg min-h-[44px] items-center cursor-text w-full justify-start font-normal h-auto',
						!selectedSkills.length && 'text-muted-foreground'
					)}
				>
					{selectedSkills.map((skill) => (
						<Badge key={skill.id} variant='secondary' className='text-sm py-1 px-2'>
							{skill.name}
							<button
								className='ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onRemoveSkill(skill);
								}}
							>
								<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
							</button>
						</Badge>
					))}
					{selectedSkills.length === 0 ? (
						<span className='text-muted-foreground'>Add a skill...</span>
					) : (
						<span className='text-muted-foreground text-sm'>Add more...</span>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
				<Command shouldFilter={false} onKeyDown={handleKeyDown}>
					<CommandInput
						placeholder='Search skill...'
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						{isLoadingSuggestions && (
							<div className='p-2 flex justify-center'>
								<Loader2 className='h-6 w-6 animate-spin' />
							</div>
						)}
						{!isLoadingSuggestions && debouncedSearch && suggestedSkills.length === 0 && (
							<CommandEmpty>No skill found.</CommandEmpty>
						)}
						{!isLoadingSuggestions && !debouncedSearch && (
							<CommandEmpty>Type to search for skills.</CommandEmpty>
						)}
						<CommandGroup>
							{suggestedSkills.map((skill) => (
								<CommandItem
									key={skill.id}
									value={skill.name}
									onSelect={() => {
										handleSelectSkill(skill);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											selectedSkills.some((s) => s.name === skill.name) ? 'opacity-100' : 'opacity-0'
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
	);
});

export function ProfileFormSkills() {
	const { toast } = useToast();
	const [skills, setSkills] = React.useState<ICommonMasterData[]>([]);
	const [isSkillsLoading, setIsSkillsLoading] = React.useState(true);
	const [isSaving, setIsSaving] = React.useState(false);

	const loadSkills = React.useCallback(async () => {
		setIsSkillsLoading(true);
		try {
			// Assuming user ID is 2 for now as requested
			const response = await JobseekerProfileService.getSkills('2');
			setSkills(response.body);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to load skills.',
				variant: 'danger',
			});
		} finally {
			setIsSkillsLoading(false);
		}
	}, [toast]);

	React.useEffect(() => {
		loadSkills();
	}, [loadSkills]);

	const handleAddSkill = (skill: ICommonMasterData) => {
		if (skill.name && !skills.some((s) => s.name === skill.name)) {
			setSkills([...skills, skill]);
		}
	};

	const handleRemoveSkill = (skillToRemove: ICommonMasterData) => {
		setSkills(skills.filter((skill) => skill.name !== skillToRemove.name));
	};

	const handleSaveChanges = async () => {
		setIsSaving(true);
		const skillIds = skills.map((s) => s.id).filter((id): id is string => !!id);
		JobseekerProfileService.saveSkills({ userId: 2, skillIds })
			.then((res) => {
				toast({
					description: res.message || 'Your skills have been successfully saved.',
					variant: 'success',
				});
			})
			.catch((error) => {
				toast({
					description: error?.message || 'Failed to save skills.',
					variant: 'danger',
				});
			})
			.finally(() => setIsSaving(false));
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
				{isSkillsLoading ? (
					<Skeleton className='h-11 w-full' />
				) : (
					<SkillSelector
						selectedSkills={skills}
						onAddSkill={handleAddSkill}
						onRemoveSkill={handleRemoveSkill}
					/>
				)}
			</CardContent>
			<CardFooter>
				<Button onClick={handleSaveChanges} disabled={isSaving}>
					{isSaving ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <Save className='mr-2 h-4 w-4' />}
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	);
}
