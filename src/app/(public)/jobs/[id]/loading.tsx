
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className='container mx-auto px-4 py-16'>
			<Skeleton className='h-10 w-32 mb-6' />
			<div className='space-y-4'>
				<Skeleton className='h-32 w-full' />
				<Skeleton className='h-64 w-full' />
			</div>
		</div>
	);
}
