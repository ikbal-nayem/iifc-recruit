
'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { IProfileCompletionStatus } from '@/interfaces/jobseeker.interface';

interface ProfileCompletionProps {
	profileCompletion: IProfileCompletionStatus;
}

export function ProfileCompletion({ profileCompletion }: ProfileCompletionProps) {
	const { completionPercentage } = profileCompletion;

	return (
		<Card className='glassmorphism w-full overflow-hidden'>
			<div className='p-4'>
				<div className='flex items-center justify-between gap-4'>
					<h3 className='text-sm font-medium text-muted-foreground'>Profile Completion</h3>
					<p className='text-lg font-bold font-headline text-primary'>{completionPercentage}%</p>
				</div>
				<Progress value={completionPercentage} className='h-2 w-full mt-2' />
			</div>
		</Card>
	);
}
