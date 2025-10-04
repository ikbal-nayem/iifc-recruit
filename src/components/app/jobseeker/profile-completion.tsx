'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Jobseeker } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { ArrowRight } from 'lucide-react';

const checklistItems = [
	{ id: 'personalInfo', label: 'Personal Info', href: '/jobseeker/profile-edit' },
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
			// @ts-ignore
			return Array.isArray(jobseeker.resumes) && jobseeker.resumes.length > 0;
		default:
			return false;
	}
}

function calculateProfileCompletion(jobseeker: Jobseeker): {
	percentage: number;
	nextStep: { label: string; href: string } | null;
} {
	let score = 0;
	let nextStep = null;

	for (const item of checklistItems) {
		if (isSectionComplete(jobseeker, item.id)) {
			score++;
		} else if (!nextStep) {
			nextStep = { label: item.label, href: item.href };
		}
	}

	const percentage = Math.round((score / checklistItems.length) * 100);

	return { percentage, nextStep };
}

export function ProfileCompletion({ jobseeker }: { jobseeker: Jobseeker }) {
	const { percentage, nextStep } = calculateProfileCompletion(jobseeker);

	return (
		<Card className='glassmorphism'>
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
					<div className='flex-shrink-0'>
						{nextStep ? (
							<Button asChild>
								<Link href={nextStep.href}>
									Next: Add {nextStep.label} <ArrowRight className='ml-2 h-4 w-4' />
								</Link>
							</Button>
						) : (
							<Button disabled>Profile is Complete</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
