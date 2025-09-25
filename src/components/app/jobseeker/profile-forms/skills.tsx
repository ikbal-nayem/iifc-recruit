
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
import type { Candidate } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MasterDataService } from '@/services/api/master-data.service';
import { Check, Loader2, Save, X } from 'lucide-react';
import * as React from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

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

	React.useEffect(() => {
		if (searchQuery.length > 0 && !open) {
			setOpen(true);
		} else if (searchQuery.length === 0 && open) {
			setOpen(false);
		}
	}, [searchQuery, open]);

	const handleAddSkill = (skill: string) => {
		if (skill && !skills.includes(skill)) {
			setSkills([...skills, skill]);
		}
		setSearchQuery('');
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setSkills(skills.filter((skill) => skill !== skillToRemove));
	};


	const handleSaveChanges = () => {
		// In a real app, you would save the skills to the backend here.
		toast({
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
				<Command className='relative'>
					<div className='flex flex-wrap gap-2 p-3 border rounded-lg min-h-[44px] items-center'>
						{skills.map((skill) => (
								<Badge key={skill} variant='secondary' className='text-sm py-1 px-2'>
									{skill}
									<ConfirmationDialog
										trigger={
											<button
												className='ml-1 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
											>
												<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
											</button>
										}
										description={`This action cannot be undone. This will permanently delete the skill "${skill}".`}
										onConfirm={() => handleRemoveSkill(skill)}
										confirmText='Delete'
									/>
								</Badge>
						))}
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
											handleAddSkill(debouncedSearch);
										}
									}}
								/>
							</PopoverTrigger>
							<PopoverContent className='w-[--radix-popover-trigger-width] p-0' align="start">
								<CommandList>
									{isLoading && (
										<div className='p-2 flex justify-center'>
											<Loader2 className='h-6 w-6 animate-spin' />
										</div>
									)}
									{!isLoading && debouncedSearch && <CommandEmpty>No skill found. Press Enter to add &quot;{debouncedSearch}&quot;</CommandEmpty>}
									{!isLoading && !debouncedSearch && <CommandEmpty>Type to search for skills.</CommandEmpty>}
									<CommandGroup>
										{suggestedSkills.map((skill) => (
											<CommandItem
												key={skill.id}
												value={skill.name}
												onSelect={(currentValue) => {
													handleAddSkill(currentValue);
													setOpen(false);
												}}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														skills.includes(skill.name) ? 'opacity-100' : 'opacity-0'
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
				<Button onClick={handleSaveChanges}>
					<Save className='mr-2 h-4 w-4' />
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	);
}
