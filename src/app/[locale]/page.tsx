import { JobListings } from '@/components/app/public/job-listings';
import { Button } from '@/components/ui/button';
import { MoveRight, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
    const t = useTranslations('Home');
	return (
		<>
			<section className='w-full py-20 md:py-32 lg:py-40 hero-gradient'>
				<div className='container relative mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl text-white md:text-5xl lg:text-6xl font-headline font-bold mb-4'>
							{t('title')}
						</h1>
						<p className='text-lg md:text-xl text-white mb-8'>
							{t('subtitle')}
						</p>
					</div>
					<div className='max-w-2xl mx-auto mt-8'>
						<Button
							size='lg'
							variant='outline'
							className='bg-white/20 border-primary/30 text-primary hover:bg-white/30 hover:text-white backdrop-blur-sm'
							asChild
						>
							<Link href='/jobs'>
								{t('browseButton')} <MoveRight className='ml-2 h-4 w-4' />
							</Link>
						</Button>
					</div>
				</div>
			</section>

			<div className='container mx-auto px-4 md:px-6 py-16'>
				<h2 className='text-3xl font-bold text-center mb-8 font-headline'>{t('featuredJobs')}</h2>
				<JobListings isPaginated={false} showFilters={false} itemLimit={6} />
				<div className='text-center mt-12'>
					<Button
						size='lg'
						variant='outline'
						className='bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 backdrop-blur-sm'
						asChild
					>
						<Link href='/jobs'>
							<Search className='mr-2 h-4 w-4' />
							{t('searchMoreButton')}
						</Link>
					</Button>
				</div>
			</div>
		</>
	);
}
