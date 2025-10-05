'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, CheckCircle, ChevronDown, Circle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import React from 'react';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';

const formToHrefMap: Record<string, string> = {
	'Personal Info': '/jobseeker/profile-edit',
	'Family': '/jobseeker/profile-edit/family',
	'Academic': '/jobseeker/profile-edit/academic',
	'Professional': '/jobseeker/profile-edit/professional',
	'Skills': '/jobseeker/profile-edit/skills',
	'Resume': '/jobseeker/profile-edit/resume',
	'Trainings': '/jobseeker/profile-edit/training',
	'Certifications': '/jobseeker/profile-edit/certifications',
	'Languages': '/jobseeker/profile-edit/languages',
	'Awards': '/jobseeker/profile-edit/awards',
	'Publications': '/jobseeker/profile-edit/publications',
	'Profile Image': '/jobseeker/profile-edit',
};

interface ProfileCompletionProps {
	profileCompletion: IProfileCompletionStatus;
}

export function ProfileCompletion({ profileCompletion }: ProfileCompletionProps) {
	const { completionPercentage, formCompletionStatus } = profileCompletion;
	const [isOpen, setIsOpen] = React.useState(true);

	const checklistItems = formCompletionStatus.map((item) => ({
		id: item.form.replace(/\s+/g, '-').toLowerCase(),
		label: item.form,
		href: formToHrefMap[item.form] || '/jobseeker/profile-edit',
		isComplete: item.isComplete,
	}));

	const nextStep = checklistItems.find((item) => !item.isComplete);

	return (
		<Card className='glassmorphism w-full'>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CardContent className='p-4'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
						<div className='flex-1'>
							<p className='font-semibold text-foreground'>
								Profile Strength: <span className='text-primary'>{completionPercentage}% Complete</span>
							</p>
							<p className='text-sm text-muted-foreground'>
								Complete your profile to stand out to recruiters.
							</p>
							<Progress value={completionPercentage} className='mt-2 h-2' />
						</div>
						<div className='flex-shrink-0 flex items-center gap-2'>
							{nextStep ? (
								<Button asChild>
									<Link href={nextStep.href}>
										Next: Add {nextStep.label} <ArrowRight className='ml-2 h-4 w-4' />
									</Link>
								</Button>
							) : (
								<Button disabled>Profile is Complete</Button>
							)}
							<CollapsibleTrigger asChild>
								<Button variant='outline' size='icon' className='h-10 w-10'>
									<ChevronDown className={cn('h-5 w-5 transition-transform', isOpen && 'rotate-180')} />
									<span className='sr-only'>Toggle checklist</span>
								</Button>
							</CollapsibleTrigger>
						</div>
					</div>
				</CardContent>
				<CollapsibleContent>
					<div className='border-t p-4'>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
							{checklistItems.map((item) => (
								<Link
									href={item.href}
									key={item.id}
									className='flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors'
								>
									{item.isComplete ? (
										<CheckCircle className='h-4 w-4 text-green-500' />
									) : (
										<Circle className='h-4 w-4 text-muted-foreground/50' />
									)}
									<span className={cn(item.isComplete ? 'text-foreground' : 'text-muted-foreground')}>
										{item.label}
									</span>
								</Link>
							))}
						</div>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
