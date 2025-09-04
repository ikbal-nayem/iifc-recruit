'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Settings,
} from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator
} from '@/components/ui/sidebar';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/jobs', label: 'Job Management', icon: Briefcase },
  { href: '/admin/candidates', label: 'Candidates', icon: Users },
];

const candidateNav = [
  { href: '/candidate', label: 'My Profile', icon: FileText },
  { href: '/', label: 'Job Listings', icon: Briefcase },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const role = pathname.split('/')[1];

  let navItems = [];
  if (role === 'admin') {
    navItems = adminNav;
  } else if (role === 'candidate') {
    navItems = candidateNav;
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                <Building2 className="h-6 w-6" />
            </div>
            <span className="font-headline text-xl font-bold">IIFC Recruit</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
