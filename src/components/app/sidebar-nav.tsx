
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
	SidebarSeparator,
	useSidebar,
} from '@/components/ui/sidebar';
import { NavLink, adminNavLinks, jobseekerNavLinks } from '@/lib/nav-links';
import { ChevronDown, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

const NavMenu = ({ item }: { item: NavLink }) => {
	const pathname = usePathname();
	const { state } = useSidebar();
	const [isOpen, setIsOpen] = React.useState(false);

	const hasSubmenu = item.submenu && item.submenu.length > 0;
	const isActive = item.isActive
		? item.isActive(pathname)
		: pathname.startsWith(item.href);
	const isSubmenuOpen =
		hasSubmenu &&
		(isOpen ||
			(item.submenu?.some((subItem) =>
				subItem.isActive ? subItem.isActive(pathname) : pathname.startsWith(subItem.href)
			) ??
				false));
	
	React.useEffect(() => {
		if (state === 'collapsed') {
			setIsOpen(false);
		}
	}, [state]);

	React.useEffect(() => {
		if (hasSubmenu) {
			const isActive =
				item.submenu?.some((subItem) =>
					subItem.isActive ? subItem.isActive(pathname) : pathname.startsWith(subItem.href)
				) ?? false;
			setIsOpen(isActive);
		}
	}, [pathname, hasSubmenu, item.submenu]);

	return (
		<SidebarMenuItem>
			<div className="group flex w-full items-center justify-between">
				<SidebarMenuButton
					asChild
					isActive={isActive}
					tooltip={item.label}
					className='flex-1 justify-start gap-3 group-data-[state=open]:bg-sidebar-accent group-data-[state=open]:text-sidebar-accent-foreground'
				>
					<Link href={item.href}>
						<item.icon className='size-5' />
						<span>{item.label}</span>
					</Link>
				</SidebarMenuButton>
				{hasSubmenu && (
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group-data-[collapsible=icon]:hidden"
						data-state={isSubmenuOpen ? 'open' : 'closed'}
					>
						<ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180' />
					</button>
				)}
			</div>
			{isSubmenuOpen && state === 'expanded' && hasSubmenu && (
				<SidebarMenuSub>
					{item.submenu?.map((subItem) => (
						<SidebarMenuItem key={subItem.href}>
							{subItem.submenu ? (
								<NavMenu item={subItem} />
							) : (
								<SidebarMenuSubButton
									asChild
									isActive={subItem.isActive ? subItem.isActive(pathname) : pathname === subItem.href}
								>
									<Link href={subItem.href}>{subItem.label}</Link>
								</SidebarMenuSubButton>
							)}
						</SidebarMenuItem>
					))}
				</SidebarMenuSub>
			)}
		</SidebarMenuItem>
	);
};

export default function SidebarNav() {
	const pathname = usePathname();
	const role = pathname.split('/')[1];

	const navItems = role === 'admin' ? adminNavLinks : role === 'jobseeker' ? jobseekerNavLinks : [];

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
