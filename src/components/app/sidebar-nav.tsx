
'use client';

import {
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarSeparator,
	useSidebar,
} from '@/components/ui/sidebar';
import { COMMON_URL } from '@/constants/common.constant';
import { useAuth } from '@/contexts/auth-context';
import { filterNavLinksByRole } from '@/lib/access-control';
import { NavLink, adminNavLinks, jobseekerNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const NavMenu = ({ item }: { item: NavLink }) => {
	const pathname = usePathname();
	const { state } = useSidebar();
	const hasSubmenu = item.submenu && item.submenu.length > 0;

	const isParentActive =
		hasSubmenu &&
		(item.submenu?.some((subItem) =>
			subItem.isActive ? subItem.isActive(pathname) : pathname.startsWith(subItem.href)
		) ??
			false);

	const isActive =
		isParentActive ||
		(item.isActive ? item.isActive(pathname) : !hasSubmenu && pathname.startsWith(item.href));

	const [isOpen, setIsOpen] = React.useState(isParentActive);

	React.useEffect(() => {
		if (state === 'collapsed') {
			setIsOpen(false);
		}
	}, [state]);

	React.useEffect(() => {
		if (hasSubmenu) {
			const isActiveNow =
				item.submenu?.some((subItem) =>
					subItem.isActive ? subItem.isActive(pathname) : pathname.startsWith(subItem.href)
				) ?? false;
			if (isActiveNow) {
				setIsOpen(true);
			}
		}
	}, [pathname, hasSubmenu, item.submenu]);

	if (item.separator) {
		return <SidebarSeparator className='my-2' />;
	}

	const LinkComponent = hasSubmenu ? 'div' : Link;

	return (
		<SidebarMenuItem>
			<Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className='w-full'>
				<Collapsible.Trigger asChild disabled={!hasSubmenu}>
					<LinkComponent
						href={hasSubmenu ? '#' : item.href}
						className={cn(
							'peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-primary data-[active=true]:font-medium data-[active=true]:text-sidebar-primary-foreground data-[state=open][data-active=false]:bg-sidebar-accent data-[state=open][data-active=false]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0',
							'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', // variant default
							'h-8 text-sm', // size default
							hasSubmenu && 'cursor-pointer'
						)}
						data-sidebar='menu-button'
						data-size='default'
						data-active={isActive}
					>
						<div className='flex items-center gap-3 w-full'>
							{!!item.icon && <item.icon className='size-5 shrink-0' />}
							<span className='flex-1'>{item.label}</span>
							{hasSubmenu && (
								<ChevronDown className='size-4 shrink-0 transition-transform duration-200 data-[state=open]:-rotate-180' />
							)}
						</div>
					</LinkComponent>
				</Collapsible.Trigger>
				{hasSubmenu && (
					<SidebarMenuSub>
						{item.submenu?.map((subItem) => (
							<NavMenu key={subItem.label} item={subItem} />
						))}
					</SidebarMenuSub>
				)}
			</Collapsible.Root>
		</SidebarMenuItem>
	);
};

export default function SidebarNav() {
	const { currectUser } = useAuth();

	const navItems = React.useMemo(() => {
		if (!currectUser) return [];
		if (currectUser.roles.includes('JOB_SEEKER')) {
			return jobseekerNavLinks.filter((link) => link.sidebar !== false);
		}
		const filteredAdminLinks = filterNavLinksByRole(adminNavLinks, currectUser.roles);
		return filteredAdminLinks.filter((link) => link.sidebar !== false);
	}, [currectUser]);

	return (
		<>
			<SidebarHeader>
				<Link href='/' className='flex items-center gap-3'>
					<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={32} height={32} className='h-8 w-auto' />
					<span className='font-headline text-xl font-bold'>IIFC Jobs</span>
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu>
					{navItems.map((item) => (
						<NavMenu key={item.label} item={item} />
					))}
				</SidebarMenu>
			</SidebarContent>
		</>
	);
}
