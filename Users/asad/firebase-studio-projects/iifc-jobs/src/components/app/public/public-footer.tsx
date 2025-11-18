'use client';

import { COMMON_URL } from '@/constants/common.constant';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

export default function PublicFooter() {
	const { t } = useTranslation();
	const quickLinks = [
		{ href: '/jobs', label: t('All Jobs') },
		{ href: '/about', label: t('About Us') },
		{ href: '/projects', label: t('Projects') },
		{ href: '/sectors', label: t('Sectors') },
		{ href: '/services', label: t('Services') },
		{ href: '/contact', label: t('Contact Us') },
	];

	const resourceLinks = [
		{ href: '#', label: t('FAQ') },
		{ href: '#', label: t('Privacy Policy') },
		{ href: '#', label: t('Terms of Service') },
	];

	return (
		<footer className='bg-background border-t'>
			<div className='container mx-auto px-4 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='md:col-span-1'>
						<Link href='/' className='flex items-center gap-3 mb-4'>
							<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} />
							<span className='text-xl font-bold font-headline'>IIFC Jobs</span>
						</Link>
						<p className='text-muted-foreground text-sm'>{t('Connecting talent with opportunity.')}</p>
					</div>

					<div>
						<h3 className='font-semibold mb-4'>{t('Quick Links')}</h3>
						<ul className='space-y-2'>
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className='text-sm text-muted-foreground hover:text-primary'>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='font-semibold mb-4'>{t('Resources')}</h3>
						<ul className='space-y-2'>
							{resourceLinks.map((link) => (
								<li key={link.label}>
									<Link href={link.href} className='text-sm text-muted-foreground hover:text-primary'>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='font-semibold mb-4'>{t('Contact Us')}</h3>
						<address className='not-italic text-sm text-muted-foreground space-y-2'>
							<p>Ede-II, 6/B, 147, Mohakhali, Dhaka-1212</p>
							<p>
								Email:{' '}
								<a href='mailto:info@iifc.gov.bd' className='hover:text-primary'>
									info@iifc.gov.bd
								</a>
							</p>
						</address>
						<div className='mt-4'>
							<LanguageSwitcher />
						</div>
					</div>
				</div>
			</div>
			<div className='bg-muted/50 py-4 border-t'>
				<div className='container mx-auto px-4 text-center text-sm text-muted-foreground'>
					&copy; {new Date().getFullYear()} IIFC. {t('All rights reserved.')}
				</div>
			</div>
		</footer>
	);
}
