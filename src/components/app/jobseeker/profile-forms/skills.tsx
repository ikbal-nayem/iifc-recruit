
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
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { MasterDataService } from '@/services/api/master-data.service';
import { Check, Loader2, Save, X } from 'lucide-react';
import * as React from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { JobseekerSkillService } from '@/services/api/jobseeker-skill.service';
import { Skeleton } from '@/components/ui/skeleton';

export function ProfileFormSkills() {
	const { toast } = useToast();
	const [skills, setSkills] = React.useState<ICommonMasterData[]>([]);
	const [isSkillsLoading, setIsSkillsLoading] = React.useState(true);
	const [isSaving, setIsSaving] = React.useState(false);

	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [suggestedSkills, setSuggestedSkills] = React.useState<ICommonMasterData[]>([]);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);

	const debouncedSearch = useDebounce(searchQuery, 300);

	const loadSkills = React.useCallback(async () => {
		setIsSkillsLoading(true);
		try {
			// Assuming user ID is 2 for now as requested
			const response = await JobseekerSkillService.getSkillsByUserId('2');
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

	React.useEffect(() => {
		if (searchQuery.length > 0 && !open) {
			setOpen(true);
		} else if (searchQuery.length === 0 && open) {
			setOpen(false);
		}
	}, [searchQuery, open]);

	const handleAddSkill = (skill: ICommonMasterData) => {
		if (skill.name && !skills.some((s) => s.name === skill.name)) {
			setSkills([...skills, skill]);
		}
		setSearchQuery('');
	};

	const handleRemoveSkill = (skillToRemove: ICommonMasterData) => {
		setSkills(skills.filter((skill) => skill.id !== skillToRemove.id));
	};

	const handleSaveChanges = async () => {
		setIsSaving(true);
		try {
			const skillIds = skills.map((s) => s.id).filter((id): id is string => !!id);
			await JobseekerSkillService.saveSkills({ userId: 2, skillIds });
			toast({
				description: 'Your skills have been successfully saved.',
				variant: 'success',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to save skills.',
				variant: 'danger',
			});
		} finally {
			setIsSaving(false);
		}
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
				<Command className='relative'>
					<div className='flex flex-wrap gap-2 p-3 border rounded-lg min-h-[44px] items-center'>
						{isSkillsLoading ? (
							<Skeleton className='h-6 w-32' />
						) : (
							skills.map((skill) => (
								<Badge key={skill.id} variant='secondary' className='text-sm py-1 px-2'>
									{skill.name}
									<ConfirmationDialog
										trigger={
											<button className='ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
												<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
											</button>
										}
										description={`This action cannot be undone. This will permanently delete the skill "${skill.name}".`}
										onConfirm={() => handleRemoveSkill(skill)}
										confirmText='Delete'
									/>
								</Badge>
							))
						)}
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<CommandInput
									placeholder='Add a skill...'
									value={searchQuery}
									onValueChange={setSearchQuery}
									className='h-auto bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1'
									onKeyDown={(e) => {
										if (e.key === 'Enter' && debouncedSearch && suggestedSkills.length === 0) {
											e.preventDefault();
											handleAddSkill({ name: debouncedSearch, isActive: true });
										}
									}}
								/>
							</PopoverTrigger>
							<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align='start'>
								<CommandList>
									{isLoadingSuggestions && (
										<div className='p-2 flex justify-center'>
											<Loader2 className='h-6 w-6 animate-spin' />
										</div>
									)}
									{!isLoadingSuggestions && debouncedSearch && (
										<CommandEmpty>No skill found. Press Enter to add &quot;{debouncedSearch}&quot;</CommandEmpty>
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
													handleAddSkill(skill);
													setOpen(false);
												}}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														skills.some((s) => s.name === skill.name) ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{skill.name}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</PopoverContent>
						</Popover>
					</div>
				</Command>
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
