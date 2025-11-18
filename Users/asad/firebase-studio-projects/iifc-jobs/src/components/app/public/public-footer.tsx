'use client';

import { COMMON_URL } from '@/constants/common.constant';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

export default function PublicFooter() {
	const { t } = useTranslation();

	const quickLinks = [
		{ label: t('All Jobs'), href: '/jobs' },
		{ label: t('About Us'), href: '/about' },
		{ label: t('Projects'), href: '/projects' },
		{ label: t('Sectors'), href: '/sectors' },
	];

	const resources = [
		{ label: t('FAQ'), href: '#' },
		{ label: t('Privacy Policy'), href: '#' },
		{ label: t('Terms of Service'), href: '#' },
	];

	return (
		<footer className='bg-primary/5'>
			<div className='container mx-auto px-4 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='md:col-span-1 space-y-4'>
						<Link href='/' className='flex items-center gap-3'>
							<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} />
							<span className='font-headline text-2xl font-bold'>IIFC Jobs</span>
						</Link>
						<p className='text-muted-foreground'>{t('Connecting talent with opportunity.')}</p>
						<LanguageSwitcher />
					</div>
					<div className='space-y-4'>
						<h4 className='font-bold uppercase tracking-wider text-sm'>{t('Quick Links')}</h4>
						<ul className='space-y-2'>
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className='text-muted-foreground hover:text-primary'>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className='space-y-4'>
						<h4 className='font-bold uppercase tracking-wider text-sm'>{t('Resources')}</h4>
						<ul className='space-y-2'>
							{resources.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className='text-muted-foreground hover:text-primary'>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className='space-y-4'>
						<h4 className='font-bold uppercase tracking-wider text-sm'>{t('Contact Us')}</h4>
						<p className='text-muted-foreground'>Ede-II, 6/B, 147, Mohakhali, Dhaka-1212</p>
						<p className='text-muted-foreground'>info@iifc.gov.bd</p>
					</div>
				</div>
				<div className='mt-12 pt-8 border-t text-center text-sm text-muted-foreground'>
					&copy; {new Date().getFullYear()} IIFC. {t('All rights reserved.')}
				</div>
			</div>
		</footer>
	);
}
