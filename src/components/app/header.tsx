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
import { ROLES } from '@/constants/auth.constant';
import { useAuth } from '@/contexts/auth-context';
import { makePreviewURL } from '@/lib/file-oparations';
import { adminNavLinks, jobseekerNavLinks } from '@/lib/nav-links';
import { LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const getBreadcrumbs = (pathname: string) => {
	const parts = pathname.split('/').filter(Boolean);
	return parts.map((part, index) => {
		const href = '/' + parts.slice(0, index + 1).join('/');
		let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
		return { href, label };
	});
};

export default function Header() {
	const pathname = usePathname();
	const router = useRouter();
	const { currectUser, logout } = useAuth();

	const breadcrumbs = getBreadcrumbs(pathname);

	const getNavLinks = () => {
		if (!currectUser?.roles.includes(ROLES.JOB_SEEKER)) {
			return adminNavLinks;
		}
		if (currectUser?.userType === 'JOB_SEEKER') {
			return jobseekerNavLinks;
		}
		return [];
	};
	const navLinks = getNavLinks();

	const headerLinks = navLinks.filter((link) => link.inHeader);

	return (
		<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-4 md:px-6'>
			<div className='flex items-center gap-2'>
				<SidebarTrigger className='md:hidden' />
				<nav className='hidden md:flex items-center text-sm font-medium text-muted-foreground'>
					{breadcrumbs.map((crumb, index) => (
						<React.Fragment key={crumb.href}>
							{index > 0 && <span className='mx-2'>/</span>}
							{/* <Link href={crumb.href} className='hover:text-foreground transition-colors'> */}
							{crumb.label}
							{/* </Link> */}
						</React.Fragment>
					))}
				</nav>
			</div>

			<div className='flex-1' />

			{currectUser && (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='relative h-9 w-9 rounded-full'>
							<Avatar>
								<AvatarImage
									src={makePreviewURL(currectUser.profileImage?.filePath) || '/user-placeholder.png'}
									alt={currectUser.fullName || currectUser.firstName}
								/>
								<AvatarFallback>
									{currectUser.fullName?.charAt(0) || currectUser.firstName?.charAt(0)}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className='w-56' align='end' forceMount>
						<DropdownMenuLabel className='font-normal'>
							<div className='flex flex-col space-y-1'>
								<p className='text-sm font-medium leading-none'>
									{currectUser.fullName || currectUser.firstName}
								</p>
								<p className='text-xs leading-none text-muted-foreground'>{currectUser.email}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{headerLinks.map((link) => (
							<DropdownMenuItem key={link.href} onClick={() => router.push(link.href)}>
								{link.icon && <link.icon className='mr-2 h-4 w-4' />}
								<span>{link.label}</span>
							</DropdownMenuItem>
						))}
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={logout}>
							<LogOut className='mr-2 h-4 w-4' />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</header>
	);
}
