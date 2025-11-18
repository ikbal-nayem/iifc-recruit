'use client';

import { COMMON_URL } from '@/constants/common.constant';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

export default function PublicFooter() {
	const { t } = useTranslation();

	return (
		<footer className='bg-primary/90 text-primary-foreground'>
			<div className='container mx-auto px-4 md:px-6 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='md:col-span-1'>
						<Link href='/' className='flex items-center gap-3 mb-4'>
							<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} className='h-10 w-auto' />
							<span className='font-headline text-2xl font-bold'>IIFC Jobs</span>
						</Link>
						<p className='text-sm text-primary-foreground/80'>{t('Connecting talent with opportunity.')}</p>
					</div>

					<div>
						<h4 className='font-semibold mb-4'>{t('Quick Links')}</h4>
						<ul className='space-y-2 text-sm text-primary-foreground/80'>
							<li>
								<Link href='/jobs' className='hover:underline'>
									{t('All Jobs')}
								</Link>
							</li>
							<li>
								<Link href='/about' className='hover:underline'>
									{t('About Us')}
								</Link>
							</li>
							<li>
								<Link href='/contact' className='hover:underline'>
									{t('Contact Us')}
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='font-semibold mb-4'>{t('Resources')}</h4>
						<ul className='space-y-2 text-sm text-primary-foreground/80'>
							<li>
								<Link href='#' className='hover:underline'>
									{t('FAQ')}
								</Link>
							</li>
							<li>
								<Link href='#' className='hover:underline'>
									{t('Privacy Policy')}
								</Link>
							</li>
							<li>
								<Link href='#' className='hover:underline'>
									{t('Terms of Service')}
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<LanguageSwitcher />
					</div>
				</div>

				<div className='mt-8 pt-6 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60'>
					&copy; {new Date().getFullYear()} IIFC. {t('All rights reserved.')}
				</div>
			</div>
		</footer>
	);
}
