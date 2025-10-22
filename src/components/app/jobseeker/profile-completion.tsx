'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';
import { cn } from '@/lib/utils';
import { ArrowRight, CheckCircle, Circle } from 'lucide-react';
import Link from 'next/link';

const formToHrefMap: Record<string, string> = {
	'Personal Info': '/jobseeker/profile-edit',
	Family: '/jobseeker/profile-edit/family',
	Academic: '/jobseeker/profile-edit/academic',
	Professional: '/jobseeker/profile-edit/professional',
	Skills: '/jobseeker/profile-edit/skills',
	Resume: '/jobseeker/profile-edit/resume',
	Trainings: '/jobseeker/profile-edit/training',
	Certifications: '/jobseeker/profile-edit/certifications',
	Languages: '/jobseeker/profile-edit/languages',
	Awards: '/jobseeker/profile-edit/awards',
	Publications: '/jobseeker/profile-edit/publications',
	'Profile Image': '/jobseeker/profile-edit',
};

interface ProfileCompletionProps {
	profileCompletion: IProfileCompletionStatus;
}

export function ProfileCompletion({ profileCompletion }: ProfileCompletionProps) {
	const { completionPercentage, formCompletionStatus } = profileCompletion;

	const checklistItems = formCompletionStatus.map((item) => ({
		id: item.form.replace(/\s+/g, '-').toLowerCase(),
		label: item.form,
		href: formToHrefMap[item.form] || '/jobseeker/profile-edit',
		isComplete: item.isComplete,
	}));

	const nextStep = checklistItems.find((item) => !item.isComplete);

	return (
		<Card className='glassmorphism w-full overflow-hidden'>
			<div className='flex flex-col md:flex-row'>
				<div className='p-6 md:w-1/3 md:border-r bg-muted/30 flex flex-col justify-center items-center text-center'>
					<h3 className='text-lg font-medium text-muted-foreground'>Profile Strength</h3>
					<p className='text-6xl font-bold font-headline text-primary my-2'>{completionPercentage}%</p>
					<Progress value={completionPercentage} className='h-2 w-full max-w-xs mx-auto' />
					{nextStep ? (
						<Button asChild className='mt-4'>
							<Link href={nextStep.href}>
								Next: Add {nextStep.label} <ArrowRight className='ml-2 h-4 w-4' />
							</Link>
						</Button>
					) : (
						<div className='mt-4 flex items-center gap-2 text-green-600'>
							<CheckCircle className='h-5 w-5' />
							<span className='font-semibold'>Profile is Complete!</span>
						</div>
					)}
				</div>
				<div className='p-6 md:w-2/3'>
					<h3 className='font-semibold mb-4'>Profile Checklist</h3>
					<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3'>
						{checklistItems.map((item) => (
							<Link
								href={item.href}
								key={item.id}
								className='flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors group'
							>
								{item.isComplete ? (
									<CheckCircle className='h-4 w-4 text-green-600 shrink-0' />
								) : (
									<Circle className='h-4 w-4 text-muted-foreground/50 shrink-0' />
								)}
								<span
									className={cn(
										item.isComplete ? 'text-foreground' : 'text-muted-foreground',
										'group-hover:text-primary transition-colors'
									)}
								>
									{item.label}
								</span>
							</Link>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
}
