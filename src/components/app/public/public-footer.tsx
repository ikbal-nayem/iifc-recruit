import { COMMON_URL } from '@/constants/common.constant';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function PublicFooter() {
	const t = useTranslations('PublicFooter');

	const quickLinks = [
		{ href: '/jobs', label: t('allJobs') },
		{ href: '/about', label: t('aboutUs') },
		{ href: '/projects', label: 'Projects' },
		{ href: '/sectors', label: 'Sectors' },
		{ href: '/services', label: 'Services' },
	];

	const resourceLinks = [
		{ href: '#', label: t('faq') },
		{ href: '#', label: t('privacyPolicy') },
		{ href: '#', label: t('termsOfService') },
	];

	return (
		<footer className='bg-background border-t'>
			<div className='container mx-auto px-4 py-12'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
					<div className='md:col-span-1'>
						<div className='flex items-center gap-3 mb-4'>
							<Image
								src={COMMON_URL.SITE_LOGO}
								alt='IIFC Logo'
								width={40}
								height={40}
								className='h-10 w-auto'
							/>
							<span className='font-headline text-2xl font-bold'>IIFC Jobs</span>
						</div>
						<p className='text-muted-foreground max-w-xs'>{t('tagline')}</p>
					</div>

					<div>
						<h3 className='font-headline text-lg font-semibold'>{t('quickLinks')}</h3>
						<ul className='mt-4 space-y-2'>
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className='text-muted-foreground hover:text-primary'>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='font-headline text-lg font-semibold'>{t('resources')}</h3>
						<ul className='mt-4 space-y-2'>
							{resourceLinks.map((link) => (
								<li key={link.label}>
									<Link href={link.href} className='text-muted-foreground hover:text-primary'>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='font-headline text-lg font-semibold'>{t('contactUs')}</h3>
						<ul className='mt-4 space-y-2 text-muted-foreground'>
							<li>Ede-II, 6/B, 147, Mohakhali</li>
							<li>Dhaka-1212</li>
							<li>
								Email:{' '}
								<a href='mailto:info@iifc.gov.bd' className='hover:text-primary'>
									info@iifc.gov.bd
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-12 border-t pt-8 text-center text-sm text-muted-foreground'>
					<p>&copy; {new Date().getFullYear()} IIFC. {t('copyright')}</p>
				</div>
			</div>
		</footer>
	);
}
