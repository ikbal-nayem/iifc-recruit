'use client';

import { useLocale } from '@/contexts/locale-context';
import { COMMON_URL } from '@/constants/common.constant';
import { useTranslations } from '@/hooks/use-translations';
import { Facebook, Linkedin, Youtube, Languages, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { AttachmentService } from '@/services/api/attachment.service';
import { IAttachment } from '@/interfaces/common.interface';
import { makeDownloadURL } from '@/lib/file-oparations';
import { Skeleton } from '@/components/ui/skeleton';

const translations = {
	en: {
		quickLinks: 'Quick Links',
		documents: 'Documents',
		connectWithUs: 'Connect With Us',
		jobsLink: 'All Jobs',
		aboutLink: 'About Us',
		contactLink: 'Contact Us',
		privacyPolicyLink: 'Privacy Policy',
		termsOfServiceLink: 'Terms of Service',
		language: 'Language',
		policy: 'Policy',
		approvalOfMf: 'Approval of MF',
	},
	bn: {
		quickLinks: 'দ্রুত লিঙ্ক',
		documents: 'নথিপত্র',
		connectWithUs: 'আমাদের সাথে সংযুক্ত হন',
		jobsLink: 'সকল চাকরি',
		aboutLink: 'আমাদের সম্পর্কে',
		contactLink: 'যোগাযোগ',
		privacyPolicyLink: 'গোপনীয়তা নীতি',
		termsOfServiceLink: 'সেবার শর্তাবলী',
		language: 'ভাষা',
		policy: 'নীতি',
		approvalOfMf: 'এমএফ এর অনুমোদন',
	},
};

export default function PublicFooter() {
	const { locale, setLocale } = useLocale();
	const t = useTranslations(translations);
	const [attachments, setAttachments] = useState<IAttachment[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		AttachmentService.getPublicAttachments(['POLICY', 'APPROVAL_OF_MF'])
			.then((res) => {
				setAttachments(res.body || []);
			})
			.catch(() => {
				// Silently fail, don't show error toast
			})
			.finally(() => setIsLoading(false));
	}, []);

	const otherLocale = locale === 'en' ? 'bn' : 'en';

	const getAttachmentByType = (type: string) => {
		return attachments.find((att) => att.type === type && att.isDefault);
	};

	const policyDoc = getAttachmentByType('POLICY');
	const approvalDoc = getAttachmentByType('APPROVAL_OF_MF');

	return (
		<footer className='bg-primary/5'>
			<div className='container mx-auto px-4 md:px-6 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					<div className='space-y-4'>
						<Link href='/' className='flex items-center gap-3'>
							<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} />
							<span className='font-bold text-lg font-headline'>Outsourcing Jobs</span>
						</Link>
						<p className='text-sm text-muted-foreground'>
							Facilitating private sector investment in the infrastructure of Bangladesh.
						</p>
					</div>

					<div className='space-y-4'>
						<h4 className='font-semibold'>{t.quickLinks}</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href='/' className='text-muted-foreground hover:text-primary'>
									{t.navigation.home}
								</Link>
							</li>
							<li>
								<Link href='/jobs' className='text-muted-foreground hover:text-primary'>
									{t.jobsLink}
								</Link>
							</li>
							<li>
								<Link href='/contact' className='text-muted-foreground hover:text-primary'>
									{t.contactLink}
								</Link>
							</li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h4 className='font-semibold'>{t.documents}</h4>
						<ul className='space-y-2 text-sm'>
							{isLoading ? (
								<>
									<Skeleton className='h-5 w-24' />
									<Skeleton className='h-5 w-32' />
								</>
							) : (
								<>
									{policyDoc && (
										<li>
											<a
												href={makeDownloadURL(policyDoc.file)}
												target='_blank'
												rel='noopener noreferrer'
												className='flex items-center text-muted-foreground hover:text-primary'
											>
												<FileText className='mr-2 h-4 w-4' />
												{t.policy}
											</a>
										</li>
									)}
									{approvalDoc && (
										<li>
											<a
												href={makeDownloadURL(approvalDoc.file)}
												target='_blank'
												rel='noopener noreferrer'
												className='flex items-center text-muted-foreground hover:text-primary'
											>
												<FileText className='mr-2 h-4 w-4' />
												{t.approvalOfMf}
											</a>
										</li>
									)}
								</>
							)}
							<li>
								<Link href='/#' className='text-muted-foreground hover:text-primary'>
									{t.privacyPolicyLink}
								</Link>
							</li>
							<li>
								<Link href='/#' className='text-muted-foreground hover:text-primary'>
									{t.termsOfServiceLink}
								</Link>
							</li>
						</ul>
					</div>

					<div className='space-y-4'>
						<h4 className='font-semibold'>{t.connectWithUs}</h4>
						<div className='flex space-x-4'>
							<Link href='https://facebook.com' target='_blank' rel='noopener noreferrer' aria-label='Facebook'>
								<Facebook className='h-6 w-6 text-muted-foreground hover:text-primary' />
							</Link>
							<Link href='https://linkedin.com' target='_blank' rel='noopener noreferrer' aria-label='LinkedIn'>
								<Linkedin className='h-6 w-6 text-muted-foreground hover:text-primary' />
							</Link>
							<Link href='https://youtube.com' target='_blank' rel='noopener noreferrer' aria-label='YouTube'>
								<Youtube className='h-6 w-6 text-muted-foreground hover:text-primary' />
							</Link>
						</div>
						<div className='pt-2'>
							<h4 className='font-semibold mb-2 text-sm'>{t.language}</h4>
							<Button variant='outline' size='sm' onClick={() => setLocale(otherLocale)}>
								<Languages className='mr-2 h-4 w-4' />
								{otherLocale === 'en' ? 'English' : 'বাংলা'}
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className='border-t'>
				<div className='container mx-auto px-4 md:px-6 py-4 text-center text-sm text-muted-foreground'>
					© {new Date().getFullYear()} IIFC Outsourcing Jobs. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
