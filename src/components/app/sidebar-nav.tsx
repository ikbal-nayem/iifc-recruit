'use client';

import {
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarSeparator,
	useSidebar,
} from '@/components/ui/sidebar';
import { NavLink, adminNavLinks, candidateNavLinks } from '@/lib/nav-links';
import { ChevronDown, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

const NavMenu = ({ item }: { item: NavLink }) => {
	const pathname = usePathname();
	const { state } = useSidebar();
	const router = useRouter();
	const [isOpen, setIsOpen] = React.useState(false);

	const hasSubmenu = item.submenu && item.submenu.length > 0;
	const isActive = item.isActive
		? item.isActive(pathname, window.location.hash)
		: pathname.startsWith(item.href);
	const isSubmenuOpen =
		hasSubmenu &&
		(isOpen ||
			(item.submenu?.some((subItem) =>
				subItem.isActive ? subItem.isActive(pathname) : pathname === subItem.href
			) ??
				false));

	const handleMenuClick = () => {
		if (state !== 'expanded' && hasSubmenu) {
			router.push(item.href);
		} else {
			setIsOpen(!isOpen);
		}
	};

	React.useEffect(() => {
		if (state === 'collapsed') {
			setIsOpen(false);
		}
	}, [state]);

	React.useEffect(() => {
		if (hasSubmenu) {
			const isActive =
				item.submenu?.some((subItem) =>
					subItem.isActive ? subItem.isActive(pathname) : pathname === subItem.href
				) ?? false;
			setIsOpen(isActive);
		}
	}, [pathname, hasSubmenu, item.submenu]);

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild={!hasSubmenu || state !== 'expanded'}
				onClick={handleMenuClick}
				isActive={isActive}
				tooltip={item.label}
				data-state={isSubmenuOpen && hasSubmenu ? 'open' : 'closed'}
				className='gap-3 group'
			>
				<Link href={item.href} className='flex items-center justify-between w-full'>
					<div className='flex items-center gap-3'>
						<item.icon className='size-5' />
						<span>{item.label}</span>
					</div>
					{hasSubmenu && (
						<ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180' />
					)}
				</Link>
			</SidebarMenuButton>
			{isSubmenuOpen && state === 'expanded' && hasSubmenu && (
				<SidebarMenuSub>
					{item.submenu?.map((subItem) => (
						<SidebarMenuSubItem key={subItem.href}>
							<SidebarMenuSubButton
								asChild
								isActive={subItem.isActive ? subItem.isActive(pathname) : pathname === subItem.href}
							>
								<Link href={subItem.href}>{subItem.label}</Link>
							</SidebarMenuSubButton>
						</SidebarMenuSubItem>
					))}
				</SidebarMenuSub>
			)}
		</SidebarMenuItem>
	);
};

export default function SidebarNav() {
	const pathname = usePathname();
	const role = pathname.split('/')[1];

	const navItems = role === 'admin' ? adminNavLinks : role === 'candidate' ? candidateNavLinks : [];

	return (
		<>
			<SidebarHeader>
				<Link href='/' className='flex items-center gap-3'>
					<Image src='/iifc-logo.png' alt='IIFC Logo' width={32} height={32} className='h-8 w-auto' />
					<span className='font-headline text-xl font-bold'>IIFC Jobs</span>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{navItems.map((item) => (
						<NavMenu key={item.href} item={item} />
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<SidebarSeparator />
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							isActive={pathname === `/${role}/settings`}
							tooltip='Settings'
							className='gap-3'
						>
							<Link href='#' className='flex items-center gap-3'>
								<Settings className='size-5' />
								<span>Settings</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</>
	);
}
