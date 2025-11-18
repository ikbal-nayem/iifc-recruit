
'use client';

import { Button } from '@/components/ui/button';
import { COMMON_URL } from '@/constants/common.constant';
import { ROUTES } from '@/constants/routes.constant';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

export default function PublicHeader() {
	const pathname = usePathname();
	const { t } = useTranslation();

	const navLinks = [
		{ href: '/jobs', label: t('Jobs') },
		{ href: '/about', label: t('About') },
		{ href: '/projects', label: t('Projects') },
		{ href: '/sectors', label: t('Sectors') },
		{ href: '/services', label: t('Services') },
		{ href: '/contact', label: t('Contact') },
	];

	return (
		<header className='sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm shadow-sm'>
			<div className='container mx-auto flex h-20 items-center justify-between px-4'>
				<Link href='/' className='flex items-center gap-3'>
					<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} className='h-10 w-auto' />
					<span className='font-headline text-2xl font-bold'>IIFC Jobs</span>
				</Link>

				<nav className='hidden items-center gap-6 text-sm font-medium lg:flex'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`transition-colors hover:text-primary ${
								pathname === link.href ? 'text-primary font-semibold' : 'text-muted-foreground'
							}`}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className='flex items-center gap-2'>
					<div className='hidden items-center gap-2 md:flex'>
						<Button variant='ghost' asChild>
							<Link href={ROUTES.AUTH.LOGIN}>{t('Login')}</Link>
						</Button>
						<Button asChild>
							<Link href={ROUTES.AUTH.SIGNUP}>{t('Sign Up')}</Link>
						</Button>
					</div>
					<LanguageSwitcher />
				</div>
			</div>
		</header>
	);
}
