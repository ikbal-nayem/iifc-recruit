
'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface ApplicationStatsProps {
	statuses: EnumDTO[];
	applicants: any[];
	statusFilter: string | null;
	onFilterChange: (status: string | null) => void;
}

export function ApplicationStats({
	statuses,
	applicants,
	statusFilter,
	onFilterChange,
}: ApplicationStatsProps) {
	const applicantStats = useMemo(() => {
		const stats: Record<string, number> = {};
		statuses.forEach((status) => {
			stats[status.value] = 0;
		});
		stats.total = 0;

		applicants.forEach((applicant) => {
			if (stats.hasOwnProperty(applicant.status)) {
				stats[applicant.status]++;
			}
		});
		stats.total = applicants.length;
		return stats;
	}, [applicants, statuses]);

	const mainStatItems = statuses.map((status) => ({
		label: status.nameEn,
		value: applicantStats[status.value] || 0,
		status: status.value,
	}));

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
					<p className='text-3xl font-bold'>{applicantStats.total || 0}</p>
					<p className='text-sm text-muted-foreground'>Total Applicants</p>
				</Card>

				{mainStatItems.map((item) => (
					<Card
						key={item.label}
						onClick={() => onFilterChange(item.status)}
						className={cn(
							'p-2 rounded-lg cursor-pointer transition-all text-center hover:bg-muted min-w-[160px]',
							statusFilter === item.status && 'bg-primary/10 border-2 border-primary'
						)}
					>
						<p className='text-3xl font-bold'>{item.value}</p>
						<p className='text-sm text-muted-foreground'>{item.label}</p>
					</Card>
				))}
			</div>
			<ScrollBar orientation='horizontal' />
		</ScrollArea>
	);
}
