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
		// { href: '#', label: t('Resources') },
		// { href: '#', label: t('FAQ') },
	];

	const legalLinks = [
		// { href: '#', label: t('Privacy Policy') },
		// { href: '#', label: t('Terms of Service') },
		{ href: '/contact', label: t('Contact Us') },
	];

	return (
		<footer className='bg-white/50 border-t border-border/20 backdrop-blur-sm'>
			<div className='container mx-auto px-4 md:px-6 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='md:col-span-1 space-y-4'>
						<div className='flex items-center gap-2'>
							<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Jobs Logo' width={40} height={40} />
							<span className='text-xl font-bold font-headline'>IIFC Jobs</span>
						</div>
						<p className='text-muted-foreground text-sm'>{t('Connecting talent with opportunity.')}</p>
					</div>
					<div className='md:col-span-1'>
						<h4 className='font-semibold mb-4'>{t('Quick Links')}</h4>
						<ul className='space-y-2'>
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className='text-sm text-muted-foreground hover:text-primary transition-colors'
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className='md:col-span-1'>
						<h4 className='font-semibold mb-4'>{t('Legal')}</h4>
						<ul className='space-y-2'>
							{legalLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className='text-sm text-muted-foreground hover:text-primary transition-colors'
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div className='md:col-span-1'>
						<h4 className='font-semibold mb-4'>{t('language')}</h4>
						<LanguageSwitcher />
					</div>
				</div>
				<div className='mt-8 pt-8 border-t text-center text-sm text-muted-foreground'>
					<p>&copy; {new Date().getFullYear()} IIFC. {t('All rights reserved.')}</p>
				</div>
			</div>
		</footer>
	);
}
