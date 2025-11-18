'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from '../../ui/button';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { COMMON_URL } from '@/constants/common.constant';
import { LanguageSwitcher } from './language-switcher';

export default function PublicHeader() {
	const pathname = usePathname();
	const { isAuthenticated } = useAuth();
	const t = useTranslations('PublicHeader');

	const navLinks = [
		{ href: '/jobs', label: t('Jobs') },
		{ href: '/about', label: t('About') },
		{ href: '/projects', label: t('Projects') },
		{ href: '/sectors', label: t('Sectors') },
		{ href: '/services', label: t('Services') },
		{ href: '/contact', label: t('Contact') },
	];

	return (
		<header className='sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm'>
			<div className='container mx-auto flex h-20 items-center justify-between px-4'>
				<Link href='/' className='flex items-center gap-3'>
					<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} className='h-10 w-auto' />
					<span className='font-headline text-2xl font-bold hidden sm:inline'>IIFC Jobs</span>
				</Link>

				<nav className='hidden items-center gap-6 text-sm font-medium lg:flex'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								'transition-colors hover:text-primary',
								pathname === link.href ? 'text-primary' : 'text-muted-foreground'
							)}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className='flex items-center gap-2'>
					<LanguageSwitcher />
					{!isAuthenticated && (
						<>
							<Button variant='outline' asChild>
								<Link href='/login'>{t('Login')}</Link>
							</Button>
							<Button asChild>
								<Link href='/signup'>{t('Sign Up')}</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
