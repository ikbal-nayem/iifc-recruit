
import {
  Briefcase,
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  isActive?: (pathname: string, hash?: string) => boolean;
  submenu?: NavLink[];
}

export const adminNavLinks: NavLink[] = [
  { 
    href: '/admin', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    isActive: (pathname) => pathname === '/admin',
  },
  { href: '/admin/jobs', label: 'Job Management', icon: Briefcase },
  { href: '/admin/candidates', label: 'Candidates', icon: Users },
];

export const candidateNavLinks: NavLink[] = [
    { 
        href: '/candidate', 
        label: 'Dashboard', 
        icon: LayoutDashboard,
        isActive: (pathname) => pathname === '/candidate'
    },
    {
        href: '/candidate/profile',
        label: 'Edit Profile',
        icon: UserCog,
        isActive: (pathname) => pathname.startsWith('/candidate/profile'),
        submenu: [
            { href: '/candidate/profile', label: 'Personal Info', icon: UserCog, isActive: (pathname) => pathname === '/candidate/profile' },
            { href: '/candidate/profile/academic', label: 'Academic', icon: UserCog },
            { href: '/candidate/profile/professional', label: 'Professional', icon: UserCog },
            { href: '/candidate/profile/skills', label: 'Skills', icon: UserCog },
            { href: '/candidate/profile/certifications', label: 'Certifications', icon: UserCog },
            { href: '/candidate/profile/languages', label: 'Languages', icon: UserCog },
            { href: '/candidate/profile/publications', label: 'Publications', icon: UserCog },
            { href: '/candidate/profile/awards', label: 'Awards', icon: UserCog },
        ]
    },
    { 
        href: '/candidate/applications', 
        label: 'My Applications', 
        icon: FileText 
    },
    { 
        href: '/', 
        label: 'Job Listings', 
        icon: Briefcase,
        isActive: (pathname) => pathname === '/'
    },
];
