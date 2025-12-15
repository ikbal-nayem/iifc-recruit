
'use client';

import { useLocale } from '@/contexts/locale-context';
import { COMMON_URL } from '@/constants/common.constant';
import { useTranslations } from '@/hooks/use-translations';
import { adminNavLinks } from '@/lib/nav-links';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FilePreviewer } from '@/components/ui/file-previewer';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { AttachmentService } from '@/services/api/attachment.service';
import { IAttachment } from '@/interfaces/common.interface';

const footerTranslations = {
	en: {
		quickLinks: 'Quick Links',
		forCandidates: 'For Candidates',
		connectWithUs: 'Connect With Us',
		jobsLink: 'All Jobs',
		aboutLink: 'About Us',
		contactLink: 'Contact Us',
		companyTagline: 'Outsourcing Jobs',
		language: 'Language',
		policy: 'Policy',
		approvalOfMf: 'Approval of MF',
	},
	bn: {
		quickLinks: 'দ্রুত লিঙ্ক',
		forCandidates: 'প্রার্থীদের জন্য',
		connectWithUs: 'আমাদের সাথে সংযুক্ত হন',
		jobsLink: 'সকল চাকরি',
		aboutLink: 'আমাদের সম্পর্কে',
		contactLink: 'যোগাযোগ',
		companyTagline: 'আউটসোর্সিং চাকরি',
		language: 'ভাষা',
		policy: 'নীতিমালা',
		approvalOfMf: 'এমএফ অনুমোদন',
	},
};

export default function PublicFooter() {
	const { locale, setLocale } = useLocale();
	const t = useTranslations(footerTranslations);
	const [documents, setDocuments] = useState<IAttachment[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const toggleLocale = () => {
		setLocale(locale === 'en' ? 'bn' : 'en');
	};

	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const res = await AttachmentService.getPublicAttachments(['POLICY', 'APPROVAL_OF_MF']);
				setDocuments(res.body || []);
			} catch (error) {
				console.error('Failed to fetch footer documents:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDocuments();
	}, []);

	return (
		<footer className='bg-primary/5 text-secondary-foreground'>
			<div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
					<div className='flex flex-col items-center md:items-start'>
						<Link href='/' className='flex items-center gap-3'>
							<Image
								src={COMMON_URL.SITE_LOGO}
								alt='IIFC Logo'
								width={40}
								height={40}
								className='h-10 w-auto'
							/>
							<span className='font-headline text-2xl font-bold'>{t.companyTagline}</span>
						</Link>
						<p className='mt-4 text-center md:text-left text-sm text-muted-foreground'>
							Facilitating private sector investment in the infrastructure of Bangladesh.
						</p>
					</div>

					<div>
						<h3 className='font-bold uppercase text-primary'>{t.quickLinks}</h3>
						<nav className='mt-4 flex flex-col items-center md:items-start space-y-2 text-sm'>
							<Link href='/jobs' className='hover:text-primary transition-colors'>
								{t.jobsLink}
							</Link>
							<Link href='/about' className='hover:text-primary transition-colors'>
								{t.aboutLink}
							</Link>
							<Link href='/contact' className='hover:text-primary transition-colors'>
								{t.contactLink}
							</Link>
						</nav>
					</div>

					<div>
						<h3 className='font-bold uppercase text-primary'>Documents</h3>
						<nav className='mt-4 flex flex-col items-center md:items-start space-y-2 text-sm'>
							{isLoading ? (
								<>
									<Skeleton className='h-5 w-24' />
									<Skeleton className='h-5 w-32' />
								</>
							) : (
								documents.map((doc) => (
									<FilePreviewer key={doc.id} file={doc.file}>
										<button className='hover:text-primary transition-colors'>
											{doc.type === 'POLICY' ? t.policy : t.approvalOfMf}
										</button>
									</FilePreviewer>
								))
							)}
						</nav>
					</div>

					<div>
						<h3 className='font-bold uppercase text-primary text-center md:text-left'>{t.connectWithUs}</h3>
						<div className='mt-4 flex justify-center md:justify-start gap-4'>
							<Link href='#' className='text-muted-foreground hover:text-primary transition-colors'>
								<Facebook className='h-6 w-6' />
							</Link>
							<Link href='#' className='text-muted-foreground hover:text-primary transition-colors'>
								<Twitter className='h-6 w-6' />
							</Link>
							<Link href='#' className='text-muted-foreground hover:text-primary transition-colors'>
								<Linkedin className='h-6 w-6' />
							</Link>
						</div>
						{/* <div className='mt-4 text-center md:text-left'>
							<h4 className='text-sm font-semibold'>{t.language}</h4>
							<Button onClick={toggleLocale} variant='link' className='p-0 text-muted-foreground'>
								{locale === 'en' ? 'বাংলা' : 'English'}
							</Button>
						</div> */}
					</div>
				</div>

				<div className='mt-8 border-t pt-8 text-center text-sm text-muted-foreground'>
					&copy; {new Date().getFullYear()} {t.companyTagline}. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
