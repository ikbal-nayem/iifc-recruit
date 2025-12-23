'use client';

import { StatusCountProps } from '@/app/(auth)/admin/application/page';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ApplicationStatsProps {
	statuses: StatusCountProps[];
	statusFilter: string[] | null;
	onFilterChange: (status: string[] | null) => void;
}

export function ApplicationStats({ statuses, statusFilter, onFilterChange }: ApplicationStatsProps) {
	const totalApplicants = statuses.reduce((sum, status) => sum + status.count, 0);

	return (
		<ScrollArea className='w-full whitespace-nowrap'>
			<div className='flex w-max space-x-4'>
				<Card
					className={cn(
						'p-2 rounded-lg cursor-pointer transition-all text-center hover:bg-muted min-w-[160px]',
						statusFilter === null && 'bg-primary/10 border-2 border-primary'
					)}
					onClick={() => onFilterChange(null)}
				>
					<p className='text-3xl font-bold'>{totalApplicants || 0}</p>
					<p className='text-sm text-muted-foreground'>Total Applicants</p>
				</Card>

				{statuses.map((item) => (
					<Card
						key={item.status}
						onClick={() => onFilterChange([item.status])}
						className={cn(
							'p-2 rounded-lg cursor-pointer transition-all text-center hover:bg-muted min-w-[160px]',
							statusFilter?.includes(item.status) && 'bg-primary/10 border-2 border-primary'
						)}
					>
						<p className='text-3xl font-bold'>{item.count}</p>
						<p className='text-sm text-muted-foreground'>{item.statusDTO.nameEn}</p>
					</Card>
				))}
			</div>
			<ScrollBar orientation='horizontal' />
		</ScrollArea>
	);
}
