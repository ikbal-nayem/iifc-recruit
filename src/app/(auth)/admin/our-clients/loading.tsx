import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='space-y-8'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='space-y-2'>
					<Skeleton className='h-9 w-48' />
					<Skeleton className='h-5 w-72' />
				</div>
				<Skeleton className='h-10 w-full sm:w-[160px]' />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{[...Array(3)].map((_, i) => (
					<div key={i} className='border rounded-lg p-4 space-y-4'>
						<div className='space-y-2'>
							<Skeleton className='h-6 w-3/4' />
							<Skeleton className='h-4 w-1/2' />
						</div>
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-4 w-2/3' />
					</div>
				))}
			</div>
		</div>
	);
}