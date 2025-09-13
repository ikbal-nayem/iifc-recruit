
'use client';

import {
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarSeparator,
	useSidebar,
} from '@/components/ui/sidebar';
import { NavLink, adminNavLinks, jobseekerNavLinks } from '@/lib/nav-links';
import { ChevronDown, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';

const NavMenu = ({ item }: { item: NavLink }) => {
	const pathname = usePathname();
	const { state } = useSidebar();
	
	const hasSubmenu = item.submenu && item.submenu.length > 0;

	const isParentActive = hasSubmenu && (item.submenu?.some(subItem => 
		subItem.isActive ? subItem.isActive(pathname) : pathname.startsWith(subItem.href)
	) ?? false);
	
	const isActive = isParentActive || (item.isActive ? item.isActive(pathname) : !hasSubmenu && pathname === item.href);

	const [isOpen, setIsOpen] = React.useState(isParentActive);

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
			if (isActive) {
				setIsOpen(true);
			}
		}
	}, [pathname, hasSubmenu, item.submenu]);


	if (hasSubmenu) {
		return (
			<Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="w-full">
				<SidebarMenuItem>
						<SidebarMenuButton
							isActive={isActive}
							tooltip={item.label}
							className='justify-between w-full'
							data-state={isOpen ? 'open' : 'closed'}
						>
							<div className="flex items-center gap-3">
								<item.icon className='size-5' />
								<span>{item.label}</span>
							</div>
							<ChevronDown className='size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180' />
						</SidebarMenuButton>
				</SidebarMenuItem>
				
				{state === 'expanded' && (
					<Collapsible.Content asChild>
						<SidebarMenuSub>
							{item.submenu?.map((subItem) => 
								<NavMenu key={subItem.label} item={subItem} />
							)}
						</SidebarMenuSub>
					</Collapsible.Content>
				)}
			</Collapsible.Root>
		);
	}

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
				<Link href={item.href}>
					<div className="flex items-center gap-3">
						<item.icon className='size-5' />
						<span>{item.label}</span>
					</div>
				</Link>
			</SidebarMenuButton>
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
						<NavMenu key={item.label} item={item} />
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
