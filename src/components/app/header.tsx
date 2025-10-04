

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Building2, LogOut, User, UserCog } from 'lucide-react';
import NProgress from 'nprogress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { jobseekers } from '@/lib/data';
import { makePreviewURL } from '@/lib/utils';

const getBreadcrumbs = (pathname: string) => {
    const parts = pathname.split('/').filter(Boolean);
    const breadcrumbs = parts.map((part, index) => {
        const href = '/' + parts.slice(0, index + 1).join('/');
        let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        if (label === 'Jobseeker') {
          label = 'Jobseeker';
        }
        return { href, label };
    });
    return breadcrumbs;
};

export default function Header() {
    const isMobile = useIsMobile();
    const pathname = usePathname();
    const router = useRouter();
    const breadcrumbs = getBreadcrumbs(pathname);
    
    // In a real app, you'd get user data from a session.
    // Here we just pick a user based on role for demonstration.
    const role = pathname.split('/')[1] || 'guest';
    let user = { firstName: 'Admin', lastName: 'User', email: 'admin@iifc.com', profileImage: { filePath: 'https://picsum.photos/seed/admin/100/100' } };
    if (role === 'jobseeker') {
        user = {
            firstName: jobseekers[0].personalInfo.firstName,
            lastName: jobseekers[0].personalInfo.lastName,
            email: jobseekers[0].personalInfo.user.email,
            profileImage: jobseekers[0].personalInfo.profileImage,
        };
    } 

    const handleLogout = () => {
        NProgress.start();
        router.push('/login');
    }

    const handleProfileClick = () => {
      const targetPath = role === 'admin' ? '/admin/profile' : '/jobseeker/profile-edit';
      router.push(targetPath);
    };

  const getFullName = () => {
    return [user.firstName, user.lastName].filter(Boolean).join(' ');
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
       <div className="flex items-center gap-2">
         <SidebarTrigger className="md:hidden" />
          <nav className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
             {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                   {index > 0 && <span className="mx-2">/</span>}
                   <Link href={crumb.href} className="hover:text-foreground transition-colors">
                     {crumb.label}
                   </Link>
                </React.Fragment>
             ))}
          </nav>
       </div>

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar>
              <AvatarImage src={makePreviewURL(user.profileImage?.filePath)} alt={getFullName()} />
              <AvatarFallback>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{getFullName()}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/${role}`)}>
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
           <DropdownMenuItem onClick={handleProfileClick}>
            <UserCog className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
