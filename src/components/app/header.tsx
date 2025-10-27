
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';
import { makePreviewURL } from '@/lib/file-oparations';
import { adminNavLinks, jobseekerNavLinks } from '@/lib/nav-links';
import { LogOut, UserCog } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const getBreadcrumbs = (pathname: string) => {
	const parts = pathname.split('/').filter(Boolean);
	const breadcrumbs = parts.map((part, index) => {
		const href = '/' + parts.slice(0, index + 1).join('/');
		let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');

		if (label === 'Jobseeker' || label === 'Admin') {
			label = 'Dashboard';
		}
		return { href, label };
	});
	return breadcrumbs;
};

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { user, logout } = useAuth();

	const breadcrumbs = getBreadcrumbs(pathname);

	const handleLogout = () => {
		logout();
		router.push('/login');
	};

	const handleProfileClick = () => {
		const targetPath =
			user?.userType === 'SYSTEM' || user?.userType === 'IIFC_ADMIN' ? '/admin/profile' : '/jobseeker/profile-edit';
		router.push(targetPath);
	};

	const getFullName = () => {
		return [user?.firstName, user?.lastName].filter(Boolean).join(' ');
	};

	const getNavLinks = () => {
		if (user?.userType === 'SYSTEM' || user?.userType === 'IIFC_ADMIN') {
			return adminNavLinks;
		}
		if (user?.userType === 'JOB_SEEKER') {
			return jobseekerNavLinks;
		}
		return [];
	};
	const navLinks = getNavLinks();

	return (
		<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-4 md:px-6'>
			<div className='flex items-center gap-2'>
				<SidebarTrigger className='md:hidden' />
				<nav className='hidden md:flex items-center text-sm font-medium text-muted-foreground'>
					{breadcrumbs.map((crumb, index) => (
						<React.Fragment key={crumb.href}>
							{index > 0 && <span className='mx-2'>/</span>}
							<Link
								href={crumb.href}
								className='hover:text-foreground transition-colors'
							>
								{crumb.label}
							</Link>
						</React.Fragment>
					))}
				</nav>
			</div>

			<div className='flex-1' />

			{user && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='relative h-9 w-9 rounded-full'>
							<Avatar>
								<AvatarImage
									src={makePreviewURL(user.profileImage?.filePath)}
									alt={getFullName()}
								/>
								<AvatarFallback>
									{user.firstName?.charAt(0)}
									{user.lastName?.charAt(0)}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-56' align='end' forceMount>
						<DropdownMenuLabel className='font-normal'>
							<div className='flex flex-col space-y-1'>
								<p className='text-sm font-medium leading-none'>{getFullName()}</p>
								<p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{navLinks
							.filter((link) => !link.separator && !link.submenu)
							.map((link) => (
								<DropdownMenuItem key={link.href} onClick={() => router.push(link.href)}>
									{link.icon && <link.icon className='mr-2 h-4 w-4' />}
									<span>{link.label}</span>
								</DropdownMenuItem>
							))}
						<DropdownMenuItem onClick={handleProfileClick}>
							<UserCog className='mr-2 h-4 w-4' />
							<span>Edit Profile</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut className='mr-2 h-4 w-4' />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</header>
	);
}
