
'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Settings,
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import { NavLink, adminNavLinks, candidateNavLinks } from '@/lib/nav-links';


const NavMenu = ({ item, isSubmenuOpen, setOpenSubmenu }: { item: NavLink, isSubmenuOpen: boolean, setOpenSubmenu: (label: string) => void }) => {
    const pathname = usePathname();
    const { state } = useSidebar();
    const router = useRouter();

    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = item.isActive ? item.isActive(pathname, window.location.hash) : pathname.startsWith(item.href);

    const handleMenuClick = () => {
        if (state !== 'expanded' && hasSubmenu) {
            router.push(item.href);
        } else {
            setOpenSubmenu(item.label);
        }
    };
    
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild={!hasSubmenu || state !== 'expanded'}
                onClick={handleMenuClick}
                isActive={isActive}
                tooltip={item.label}
                data-state={isSubmenuOpen && hasSubmenu ? 'open' : 'closed'}
            >
                <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
            {isSubmenuOpen && state === 'expanded' && hasSubmenu && (
                <SidebarMenuSub>
                    {item.submenu?.map(subItem => (
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
  const { state } = useSidebar();
  const [openSubmenu, setOpenSubmenuState] = React.useState('');

  const navItems = role === 'admin' ? adminNavLinks : role === 'candidate' ? candidateNavLinks : [];

  const setOpenSubmenu = (label: string) => {
    setOpenSubmenuState(prev => prev === label ? '' : label);
  };
  
  React.useEffect(() => {
    if (state === 'collapsed') {
      setOpenSubmenuState('');
    }
  }, [state]);

  React.useEffect(() => {
    const activeParent = navItems.find(item => item.isActive && item.isActive(pathname));
    if (activeParent?.submenu) {
        if (openSubmenu !== activeParent.label) {
            setOpenSubmenuState(activeParent.label);
        }
    } else {
        if (openSubmenu && !navItems.find(item => item.label === openSubmenu && item.isActive?.(pathname))) {
             setOpenSubmenuState('');
        }
    }
  }, [pathname, navItems, openSubmenu]);


  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-3">
            <Image src="/iifc-logo.png" alt="IIFC Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="font-headline text-xl font-bold">IIFC Recruit</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
            {navItems.map((item) => (
              <NavMenu 
                key={item.href} 
                item={item} 
                isSubmenuOpen={openSubmenu === item.label} 
                setOpenSubmenu={setOpenSubmenu}
              />
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
                tooltip="Settings"
              >
                <Link href="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
