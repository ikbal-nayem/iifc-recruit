'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  UserCog,
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

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/jobs', label: 'Job Management', icon: Briefcase },
  { href: '/admin/candidates', label: 'Candidates', icon: Users },
];

const candidateProfileSubNav = [
    { href: '/candidate/profile#personal', label: 'Personal Info' },
    { href: '/candidate/profile#academic', label: 'Academic' },
    { href: '/candidate/profile#professional', label: 'Professional' },
    { href: '/candidate/profile#skills', label: 'Skills' },
    { href: '/candidate/profile#certifications', label: 'Certifications' },
    { href: '/candidate/profile#languages', label: 'Languages' },
    { href: '/candidate/profile#publications', label: 'Publications' },
    { href: '/candidate/profile#awards', label: 'Awards' },
]

export default function SidebarNav() {
  const pathname = usePathname();
  const role = pathname.split('/')[1];
  const { state } = useSidebar();
  const [isProfileOpen, setProfileOpen] = React.useState(false);

  React.useEffect(() => {
    if (pathname.startsWith('/candidate/profile')) {
      setProfileOpen(true);
    }
  }, [pathname]);
  
   React.useEffect(() => {
    if (state === 'collapsed') {
      setProfileOpen(false);
    }
  }, [state]);


  let navItems = [];
  if (role === 'admin') {
    navItems = adminNav;
  } else if (role === 'candidate') {
    // This is a placeholder, the candidate nav is custom rendered below
  }

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-3">
            <Image src="https://iifc.gov.bd/images/iifc-logo.jpg" alt="IIFC Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="font-headline text-xl font-bold">IIFC Recruit</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {role === 'admin' && adminNav.map((item) => (
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
           {role === 'candidate' && (
            <>
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/candidate'} tooltip="Dashboard">
                        <Link href="/candidate"><LayoutDashboard /><span>Dashboard</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton 
                        asChild={state !== 'expanded'}
                        onClick={() => {
                            if (state === 'expanded') {
                                setProfileOpen(prev => !prev)
                            }
                        }}
                        isActive={pathname.startsWith('/candidate/profile')} 
                        tooltip="Edit Profile"
                        data-state={isProfileOpen ? 'open' : 'closed'}
                    >
                        <Link href="/candidate/profile">
                            <UserCog />
                            <span>Edit Profile</span>
                        </Link>
                    </SidebarMenuButton>
                    {isProfileOpen && state === 'expanded' && (
                        <SidebarMenuSub>
                            {candidateProfileSubNav.map(item => (
                                <SidebarMenuSubItem key={item.href}>
                                    <SidebarMenuSubButton asChild isActive={pathname + (typeof window !== 'undefined' ? window.location.hash : '') === item.href}>
                                        <Link href={item.href}>{item.label}</Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    )}
                </SidebarMenuItem>
                 <SidebarMenuItem>
                     <SidebarMenuButton asChild isActive={pathname === '/'} tooltip="Job Listings">
                        <Link href="/"><Briefcase /><span>Job Listings</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </>
           )}
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
