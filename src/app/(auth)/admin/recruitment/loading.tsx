import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Loading() {
	return (
		<div className='space-y-8'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='space-y-2'>
					<Skeleton className='h-9 w-48' />
					<Skeleton className='h-5 w-72' />
				</div>
				<div className='flex gap-2'>
					<Skeleton className='h-10 w-24' />
					<Skeleton className='h-10 w-24' />
				</div>
			</div>

			{/* Table Skeleton */}
			<div className='border rounded-md'>
				<Table>
					<TableHeader>
						<TableRow>
							{[...Array(5)].map((_, i) => (
								<TableHead key={i}>
									<Skeleton className='h-5 w-24' />
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(5)].map((_, i) => (
							<TableRow key={i}>
								{[...Array(5)].map((_, j) => (
									<TableCell key={j}>
										<Skeleton className='h-5 w-full' />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}