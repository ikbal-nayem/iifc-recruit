import { JobListings } from '@/components/app/public/job-listings';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
	return (
		<>
			<section className='w-full py-20 md:py-32 lg:py-40 hero-gradient'>
				<div className='container relative mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl text-white md:text-5xl lg:text-6xl font-headline font-bold mb-4'>
							Find Your Next Career Move
						</h1>
						<p className='text-lg md:text-xl text-white mb-8'>
							Search through thousands of open positions in your field. Your dream job is waiting.
						</p>
					</div>
					<div className='max-w-2xl mx-auto mt-8'>
						<Button size='lg' asChild>
							<Link href='/jobs'>Browse All Jobs</Link>
						</Button>
					</div>
				</div>
			</section>

			<div className='container mx-auto px-4 md:px-6 py-16'>
				<h2 className='text-3xl font-bold text-center mb-8 font-headline'>Featured Jobs</h2>
				<JobListings isPaginated={false} showFilters={false} itemLimit={6} />
				<div className='text-center mt-12'>
					<Button variant='outline' size='lg' asChild>
						<Link href='/jobs'>Browse All Jobs</Link>
					</Button>
				</div>
			</div>
		</>
	);
}
