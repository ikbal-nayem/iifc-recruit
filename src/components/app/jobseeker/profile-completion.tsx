'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/constants/routes.constant';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';
import { cn } from '@/lib/utils';
import { CheckCircle, CircleAlert, Edit, SquareX } from 'lucide-react';
import Link from 'next/link';

interface ProfileCompletionProps {
	profileCompletion: IProfileCompletionStatus;
	isCompact?: boolean;
}

export function ProfileCompletion({ profileCompletion, isCompact = false }: ProfileCompletionProps) {
	var { completionPercentage, formCompletionStatus } = profileCompletion;

	const getFormRoute = (form: string) => {
		const key = `PROFILE_EDIT_${form.toUpperCase().replace(' ', '_')}`;
		// @ts-ignore
		return ROUTES.JOB_SEEKER.PROFILE_EDIT[key] || ROUTES.JOB_SEEKER.PROFILE_EDIT.PERSONAL;
	};

	const color =
		completionPercentage >= 75
			? 'success'
			: completionPercentage >= 50
			? 'warning'
			: completionPercentage >= 25
			? 'danger'
			: 'red-800';

	if (isCompact) {
		return (
			<Card className='glassmorphism w-full overflow-hidden animate-fade-in-up'>
				<div className='p-4'>
					<div className='flex items-center justify-between gap-4'>
						<h3 className='font-medium text-muted-foreground'>Profile Completion</h3>
						<p
							className={cn(
								'text-lg font-bold font-headline animate-in slide-in-from-left-10 duration-500',
								`text-${color}`
							)}
						>
							{completionPercentage}%
						</p>
					</div>
					<Progress value={completionPercentage} color={color} className='h-2 w-full mt-2' />
				</div>
			</Card>
		);
	}

	return (
		<Card className='glassmorphism w-full overflow-hidden animate-fade-in-up'>
			<div className='grid grid-cols-1 md:grid-cols-3'>
				<div className='p-6 flex flex-col justify-center items-center text-center border-r'>
					<div
						className='relative h-32 w-32'
						style={
							{
								'--value': completionPercentage,
								'--size': '8rem',
								'--thickness': '0.75rem',
							} as React.CSSProperties
						}
					>
						<svg className='w-full h-full' viewBox='0 0 100 100'>
							<circle
								className='text-muted'
								strokeWidth='10'
								stroke='currentColor'
								fill='transparent'
								r='45'
								cx='50'
								cy='50'
							/>
							<circle
								className={cn('text-' + color)}
								strokeWidth='10'
								strokeDasharray='283'
								strokeDashoffset={`calc(283 - (283 * ${completionPercentage}) / 100)`}
								strokeLinecap='round'
								stroke='currentColor'
								fill='transparent'
								r='45'
								cx='50'
								cy='50'
								transform='rotate(-90 50 50)'
							/>
						</svg>
						<span
							className={cn(
								'absolute inset-0 flex items-center justify-center text-3xl font-bold font-headline',
								`text-${color}`
							)}
						>
							{completionPercentage}%
						</span>
					</div>
					<h3 className='text-xl font-bold mt-3'>Profile Completed</h3>
					<p className='text-sm text-muted-foreground mt-1'>
						Complete your profile to get better job recommendations.
					</p>
					<Button asChild size='sm' className='mt-4'>
						<Link href={ROUTES.JOB_SEEKER.PROFILE_EDIT.PERSONAL}>
							<Edit className='mr-2 h-4 w-4' /> Edit Profile
						</Link>
					</Button>
				</div>
				<div className='md:col-span-2 p-6'>
					<h4 className='font-semibold mb-4'>Profile Checklist</h4>
					<div className='grid grid-cols-2 gap-x-6 gap-y-3'>
						{formCompletionStatus.map((item) => (
							<Link href={getFormRoute(item.form)} key={item.form} className='flex items-center gap-2 group'>
								{item.isComplete ? (
									<CheckCircle className='h-5 w-5 transition-colors text-success' />
								) : (
									<SquareX className='h-5 w-5 transition-colors text-muted-foreground/50' />
								)}
								<span className='text-sm group-hover:text-primary transition-colors'>{item.form}</span>
							</Link>
						))}
					</div>
				</div>
			</div>
		</Card>
	);
}
