import { JobListings } from '@/components/app/public/job-listings';

export default function AllJobsPage() {
	return (
		<>
			<section className='w-full py-16 md:py-24 hero-gradient'>
				<div className='container mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl md:text-5xl font-headline font-bold mb-4'>All Job Openings</h1>
						<p className='text-lg md:text-xl text-muted-foreground'>
							Find your next career opportunity. Use the filters below to narrow your search.
						</p>
					</div>
				</div>
			</section>

			<div className='container mx-auto px-4 py-16'>
				<JobListings />
			</div>
		</>
	);
}
