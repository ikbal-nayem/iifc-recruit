
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Jobseeker } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, CheckCircle, ChevronDown, Circle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import React from 'react';

const checklistItems = [
	{ id: 'personalInfo', label: 'Personal Info', href: '/jobseeker/profile-edit' },
	{ id: 'family', label: 'Family Info', href: '/jobseeker/profile-edit/family' },
	{ id: 'resume', label: 'Resume', href: '/jobseeker/profile-edit/resume' },
	{ id: 'skills', label: 'Skills', href: '/jobseeker/profile-edit/skills' },
	{ id: 'professionalInfo', label: 'Work Experience', href: '/jobseeker/profile-edit/professional' },
	{ id: 'academicInfo', label: 'Academic History', href: '/jobseeker/profile-edit/academic' },
	{ id: 'certifications', label: 'Certifications', href: '/jobseeker/profile-edit/certifications' },
	{ id: 'languages', label: 'Languages', href: '/jobseeker/profile-edit/languages' },
	{ id: 'publications', label: 'Publications', href: '/jobseeker/profile-edit/publications' },
	{ id: 'awards', label: 'Awards', href: '/jobseeker/profile-edit/awards' },
	{ id: 'trainings', label: 'Trainings', href: '/jobseeker/profile-edit/training' },
];

function isSectionComplete(jobseeker: Jobseeker, section: string): boolean {
	switch (section) {
		case 'personalInfo':
			return !!(jobseeker.personalInfo.firstName && jobseeker.personalInfo.lastName && jobseeker.personalInfo.email);
		case 'academicInfo':
		case 'professionalInfo':
		case 'skills':
		case 'certifications':
		case 'languages':
		case 'publications':
		case 'awards':
		case 'trainings':
			return Array.isArray(jobseeker[section as keyof Jobseeker]) && (jobseeker[section as keyof Jobseeker] as any[]).length > 0;
		case 'resume':
			// @ts-ignore - Assuming 'resumes' is the correct property, even if not on the base type
			return Array.isArray(jobseeker.resumes) && jobseeker.resumes.length > 0;
		case 'family':
			return !!jobseeker.spouse;
		default:
			return false;
	}
}

function calculateProfileCompletion(jobseeker: Jobseeker): {
	percentage: number;
	nextStep: { label: string; href: string } | null;
	completionStatus: { id: string; label: string; href: string; isComplete: boolean }[];
} {
	let score = 0;
	let nextStep = null;
	const completionStatus = [];

	for (const item of checklistItems) {
		const isComplete = isSectionComplete(jobseeker, item.id);
		if (isComplete) {
			score++;
		} else if (!nextStep) {
			nextStep = { label: item.label, href: item.href };
		}
		completionStatus.push({ ...item, isComplete });
	}

	const percentage = Math.round((score / checklistItems.length) * 100);

	return { percentage, nextStep, completionStatus };
}

export function ProfileCompletion({ jobseeker }: { jobseeker: Jobseeker }) {
	const { percentage, nextStep, completionStatus } = calculateProfileCompletion(jobseeker);
    const [isOpen, setIsOpen] = React.useState(false);

	return (
		<Card className='glassmorphism w-full'>
			<Collapsible open={isOpen} onOpenChange={setIsOpen}>
				<CardContent className='p-4'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
						<div className='flex-1'>
							<p className='font-semibold text-foreground'>
								Profile Strength: <span className='text-primary'>{percentage}% Complete</span>
							</p>
							<p className='text-sm text-muted-foreground'>
								Complete your profile to stand out to recruiters.
							</p>
							<Progress value={percentage} className='mt-2 h-2' />
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
                                <Button variant="outline" size="icon" className="h-10 w-10">
                                    <ChevronDown className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")} />
                                    <span className="sr-only">Toggle checklist</span>
                                </Button>
                            </CollapsibleTrigger>
						</div>
					</div>
				</CardContent>
				<CollapsibleContent>
                    <div className="border-t p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {completionStatus.map(item => (
                                <Link href={item.href} key={item.id} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                                    {item.isComplete ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground/50" />
                                    )}
                                    <span className={cn(item.isComplete ? "text-foreground" : "text-muted-foreground")}>
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
