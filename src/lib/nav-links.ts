
import type { LucideIcon } from 'lucide-react';
import {
	Briefcase,
	Edit,
	FileText,
	LayoutDashboard,
	PlusCircle,
	Search,
	UserCircle,
	UserCog,
	Users,
} from 'lucide-react';

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
	{
		href: '/admin/jobs',
		label: 'Job Management',
		icon: Briefcase,
		isActive: (pathname) => pathname.startsWith('/admin/jobs'),
		submenu: [
			{
				href: '/admin/jobs',
				label: 'All Jobs',
				icon: Briefcase,
				isActive: (pathname) => /^\/admin\/jobs(\/[^/]+\/(applicants|edit))?$/.test(pathname) || pathname === '/admin/jobs',
			},
			{ 
				href: '/admin/jobs/create', 
				label: 'Create New', 
				icon: PlusCircle 
			},
		],
	},
	{ href: '/admin/candidates', label: 'Candidates', icon: Users },
];

export const candidateNavLinks: NavLink[] = [
	{
		href: '/candidate',
		label: 'Dashboard',
		icon: LayoutDashboard,
		isActive: (pathname) => pathname === '/candidate',
	},
	{
		href: '/candidate/profile-view',
		label: 'My Profile',
		icon: UserCircle,
	},
	{
		href: '/candidate/profile-edit',
		label: 'Edit Profile',
		icon: UserCog,
		isActive: (pathname) => pathname.startsWith('/candidate/profile-edit'),
		submenu: [
			{
				href: '/candidate/profile-edit',
				label: 'Personal Info',
				icon: UserCog,
				isActive: (pathname) => pathname === '/candidate/profile-edit',
			},
			{ href: '/candidate/profile-edit/academic', label: 'Academic', icon: UserCog },
			{ href: '/candidate/profile-edit/professional', label: 'Professional', icon: UserCog },
			{ href: '/candidate/profile-edit/skills', label: 'Skills', icon: UserCog },
			{ href: '/candidate/profile-edit/certifications', label: 'Certifications', icon: UserCog },
			{ href: '/candidate/profile-edit/languages', label: 'Languages', icon: UserCog },
			{ href: '/candidate/profile-edit/publications', label: 'Publications', icon: UserCog },
			{ href: '/candidate/profile-edit/awards', label: 'Awards', icon: UserCog },
			{ href: '/candidate/profile-edit/resume', label: 'Resume', icon: UserCog },
		],
	},
	{
		href: '/candidate/applications',
		label: 'My Applications',
		icon: FileText,
	},
	{
		href: '/candidate/find-job',
		label: 'Find Job',
		icon: Search,
	},
];
