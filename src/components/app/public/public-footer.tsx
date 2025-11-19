import { COMMON_URL } from '@/constants/common.constant';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';
import { getTranslations } from '@/lib/i18n-server';

export default async function PublicFooter() {
	const t = await getTranslations();

	return (
		<footer className='bg-primary/5 border-t'>
			<div className='container mx-auto px-4 md:px-6 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='space-y-4'>
						<Link href='/' className='flex items-center gap-2'>
							<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} />
							<span className='font-bold text-lg font-headline'>{t('common.siteName')}</span>
						</Link>
						<p className='text-sm text-muted-foreground'>
							{t('common.siteTagline')}
						</p>
					</div>

					<div>
						<h4 className='font-semibold mb-3'>{t('footer.quickLinks')}</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href='/jobs' className='text-muted-foreground hover:text-primary'>
									{t('footer.jobListings')}
								</Link>
							</li>
							<li>
								<Link href='/about' className='text-muted-foreground hover:text-primary'>
									{t('footer.aboutLink')}
								</Link>
							</li>
							<li>
								<Link href='/contact' className='text-muted-foreground hover:text-primary'>
									{t('footer.contactLink')}
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='font-semibold mb-3'>{t('footer.forCandidates')}</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href='/signup' className='text-muted-foreground hover:text-primary'>
									{t('footer.createAccountLink')}
								</Link>
							</li>
							<li>
								<Link href='/login' className='text-muted-foreground hover:text-primary'>
									{t('footer.candidateLoginLink')}
								</Link>
							</li>
							<li>
								<Link href='#' className='text-muted-foreground hover:text-primary'>
									{t('footer.faqLink')}
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='font-semibold mb-3'>{t('footer.connectWithUs')}</h4>
						<div className='flex space-x-3 mb-4'>
							<a
								href='https://facebook.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary'
							>
								<Facebook className='h-5 w-5' />
							</a>
							<a
								href='https://twitter.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary'
							>
								<Twitter className='h-5 w-5' />
							</a>
							<a
								href='https://linkedin.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary'
							>
								<Linkedin className='h-5 w-5' />
							</a>
						</div>
						{/* <LanguageSwitcher /> */}
					</div>
				</div>

				<div className='mt-8 border-t pt-4 text-center text-sm text-muted-foreground'>
					<p>&copy; {new Date().getFullYear()} {t('footer.companyTagline')}. {t('common.copyright')}</p>
				</div>
			</div>
		</footer>
	);
}
