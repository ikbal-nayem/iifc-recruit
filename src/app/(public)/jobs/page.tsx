import { JobListings } from '@/components/app/public/job-listings';
import { getTranslations } from '@/lib/i18n-server';

export default async function AllJobsPage() {
	const t = await getTranslations();

	return (
		<>
			<section className='w-full py-16 md:py-24 hero-gradient'>
				<div className='container mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl md:text-5xl font-headline text-white font-bold mb-4'>{t('jobs.allOpenings')}</h1>
						<p className='text-lg md:text-xl text-muted'>
							{t('jobs.description')}
						</p>
					</div>
				</div>
			</section>

			<div className='container mx-auto px-4 py-10'>
				<JobListings />
			</div>
		</>
	);
}
