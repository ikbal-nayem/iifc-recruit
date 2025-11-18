'use client';

import { COMMON_URL } from '@/constants/common.constant';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

export default function PublicFooter() {
	const { t } = useTranslation();

	const footerLinks = {
		quickLinks: [
			{ href: '/jobs', label: t('All Jobs') },
			{ href: '/about', label: t('About Us') },
			{ href: '/contact', label: t('Contact Us') },
		],
		resources: [
			{ href: '#', label: t('FAQ') },
			{ href: '#', label: t('Privacy Policy') },
			{ href: '#', label: t('Terms of Service') },
		],
	};

	return (
		<footer className='bg-primary/5'>
			<div className='container mx-auto px-4 md:px-6 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='md:col-span-1 space-y-4'>
						<Link href='/' className='flex items-center gap-3'>
							<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} className='h-10 w-auto' />
							<div>
								<p className='font-headline text-xl font-bold'>IIFC Jobs</p>
								<p className='text-sm text-muted-foreground'>{t('Connecting talent with opportunity.')}</p>
							</div>
						</Link>
						<div className='pt-2'>
							<LanguageSwitcher />
						</div>
					</div>

					<div className='col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8'>
						<div>
							<h3 className='font-semibold mb-4'>{t('Quick Links')}</h3>
							<ul className='space-y-2'>
								{footerLinks.quickLinks.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className='text-muted-foreground hover:text-primary transition-colors'
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className='font-semibold mb-4'>{t('Resources')}</h3>
							<ul className='space-y-2'>
								{footerLinks.resources.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className='text-muted-foreground hover:text-primary transition-colors'
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className='font-semibold mb-4'>{t('Contact Us')}</h3>
							<ul className='space-y-2 text-muted-foreground'>
								<li>Ede-II, 6/B, 147, Mohakhali, Dhaka-1212</li>
								<li>(+8802) 9889244, 9889255</li>
								<li>info@iifc.gov.bd</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<div className='border-t'>
				<div className='container mx-auto px-4 md:px-6 py-4 text-center text-sm text-muted-foreground'>
					© {new Date().getFullYear()} Infrastructure Investment Facilitation Company (IIFC). {t('All rights reserved.')}
				</div>
			</div>
		</footer>
	);
}
