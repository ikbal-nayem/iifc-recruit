
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ClientOrganizationDetailsLoading() {
	return (
		<div className='space-y-8'>
			<div className='space-y-2'>
				<Skeleton className='h-9 w-1/2' />
				<Skeleton className='h-5 w-1/3' />
				<div className='flex gap-2 pt-1'>
					<Skeleton className='h-6 w-16 rounded-full' />
					<Skeleton className='h-6 w-20 rounded-full' />
				</div>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<Skeleton className='h-7 w-48' />
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{[...Array(4)].map((_, i) => (
							<div key={i} className='flex items-start gap-3'>
								<Skeleton className='h-5 w-5 mt-1' />
								<div className='flex-1 space-y-1.5'>
									<Skeleton className='h-4 w-24' />
									<Skeleton className='h-4 w-full' />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card className='glassmorphism'>
				<CardHeader className='flex-row items-center justify-between'>
					<Skeleton className='h-7 w-40' />
					<Skeleton className='h-10 w-32' />
				</CardHeader>
				<CardContent className='space-y-4'>
					{[...Array(3)].map((_, i) => (
						<Card key={i} className='p-4'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-4'>
									<Skeleton className='h-12 w-12 rounded-full' />
									<div className='space-y-2'>
										<Skeleton className='h-5 w-32' />
										<Skeleton className='h-4 w-40' />
									</div>
								</div>
								<div className='flex items-center gap-4'>
									<Skeleton className='h-6 w-16 rounded-full' />
									<Skeleton className='h-6 w-20 rounded-full' />
									<Skeleton className='h-8 w-8' />
								</div>
							</div>
						</Card>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
