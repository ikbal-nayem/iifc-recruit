'use client';

import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { COMMON_URL } from '@/constants/common.constant';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

export default function PublicHeader() {
	const { t } = useTranslation();
	const { isAuthenticated, currectUser, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();

	const navLinks = [
		{ href: '/jobs', label: t('Jobs') },
		{ href: '/about', label: t('About') },
		{ href: '/projects', label: t('Projects') },
		{ href: '/sectors', label: t('Sectors') },
		{ href: '/services', label: t('Services') },
		{ href: '/contact', label: t('Contact') },
	];

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [isOpen]);

	return (
		<header className='sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm'>
			<div className='container mx-auto flex h-20 items-center justify-between px-4 md:px-6'>
				<Link href='/' className='flex items-center gap-3'>
					<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} className='h-10 w-auto' />
					<span className='font-headline text-2xl font-bold'>IIFC Jobs</span>
				</Link>

				<nav className='hidden items-center gap-6 md:flex'>
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								'text-base font-medium transition-colors hover:text-primary',
								pathname === link.href ? 'text-primary' : 'text-muted-foreground'
							)}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className='hidden items-center gap-2 md:flex'>
					{isAuthenticated ? (
						<>
							<Button asChild>
								<Link href='/admin'>{t('Dashboard')}</Link>
							</Button>
							<Button variant='outline' onClick={logout}>
								{t('Logout')}
							</Button>
						</>
					) : (
						<>
							<Button variant='ghost' asChild>
								<Link href='/login'>{t('Login')}</Link>
							</Button>
							<Button asChild>
								<Link href='/signup'>{t('Sign Up')}</Link>
							</Button>
						</>
					)}
					<LanguageSwitcher />
				</div>

				<div className='md:hidden'>
					<Button onClick={() => setIsOpen(!isOpen)} variant='ghost' size='icon'>
						{isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
					</Button>
				</div>
			</div>

			{isOpen && (
				<div className='md:hidden fixed inset-0 top-20 z-30 bg-background/95 backdrop-blur-sm animate-in fade-in-20'>
					<div className='container mx-auto flex h-full flex-col items-center justify-center gap-8 px-4 text-center'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className='text-2xl font-semibold transition-colors hover:text-primary'
								onClick={() => setIsOpen(false)}
							>
								{link.label}
							</Link>
						))}
						<div className='mt-8 flex flex-col gap-4 w-full max-w-xs'>
							{isAuthenticated ? (
								<>
									<Button size='lg' asChild onClick={() => setIsOpen(false)}>
										<Link href='/admin'>{t('Dashboard')}</Link>
									</Button>
									<Button size='lg' variant='outline' onClick={logout}>
										{t('Logout')}
									</Button>
								</>
							) : (
								<>
									<Button size='lg' variant='ghost' asChild onClick={() => setIsOpen(false)}>
										<Link href='/login'>{t('Login')}</Link>
									</Button>
									<Button size='lg' asChild onClick={() => setIsOpen(false)}>
										<Link href='/signup'>{t('Sign Up')}</Link>
									</Button>
								</>
							)}
							<div className="flex justify-center mt-4">
								<LanguageSwitcher />
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
