import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='space-y-8'>
			{/* Header Skeleton */}
			<div>
				<Skeleton className='h-9 w-48' />
				<Skeleton className='mt-2 h-5 w-72' />
			</div>

			{/* Form Skeleton */}
			<div className='space-y-6'>
				{/* Avatar Skeleton */}
				<div className='flex items-center gap-4'>
					<Skeleton className='h-20 w-20 rounded-full' />
					<div className='space-y-2'>
						<Skeleton className='h-10 w-24' />
						<Skeleton className='h-5 w-32' />
					</div>
				</div>

				{/* Form Fields Skeleton */}
				{[...Array(3)].map((_, i) => (
					<div key={i} className='space-y-2'>
						<Skeleton className='h-4 w-20' />
						<Skeleton className='h-10 w-full' />
					</div>
				))}
				<Skeleton className='h-10 w-32' />
			</div>
		</div>
	);
}