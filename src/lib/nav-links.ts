
import type { LucideIcon } from 'lucide-react';
import {
	Briefcase,
	Database,
	Edit,
	FileText,
	LayoutDashboard,
	PlusCircle,
	Search,
	UserCircle,
	UserCog,
	Users,
	GraduationCap,
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
	{ href: '/admin/jobseekers', label: 'Jobseekers', icon: Users },
  {
		href: '/admin/master-data',
		label: 'Master Data',
		icon: Database,
		isActive: (pathname) => pathname.startsWith('/admin/master-data'),
		submenu: [
			{ href: '/admin/master-data/departments', label: 'Departments', icon: Database },
			{ href: '/admin/master-data/skills', label: 'Skills', icon: Database },
			{ href: '/admin/master-data/languages', label: 'Languages', icon: Database },
      { href: '/admin/master-data/job-statuses', label: 'Job Statuses', icon: Database },
      { href: '/admin/master-data/application-statuses', label: 'Application Statuses', icon: Database },
			{
				href: '/admin/master-data/education/degree-levels',
				label: 'Education',
				icon: GraduationCap,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/education'),
				submenu: [
					{ href: '/admin/master-data/education/degree-levels', label: 'Degree Levels', icon: GraduationCap },
					{ href: '/admin/master-data/education/domains', label: 'Domains', icon: GraduationCap },
					{ href: '/admin/master-data/education/institutions', label: 'Institutions', icon: GraduationCap },
				],
			}
		],
	},
];

export const jobseekerNavLinks: NavLink[] = [
	{
		href: '/jobseeker',
		label: 'Dashboard',
		icon: LayoutDashboard,
		isActive: (pathname) => pathname === '/jobseeker',
	},
	{
		href: '/jobseeker/profile-view',
		label: 'My Profile',
		icon: UserCircle,
	},
	{
		href: '/jobseeker/profile-edit',
		label: 'Edit Profile',
		icon: UserCog,
		isActive: (pathname) => pathname.startsWith('/jobseeker/profile-edit'),
		submenu: [
			{
				href: '/jobseeker/profile-edit',
				label: 'Personal Info',
				icon: UserCog,
				isActive: (pathname) => pathname === '/jobseeker/profile-edit',
			},
			{ href: '/jobseeker/profile-edit/academic', label: 'Academic', icon: UserCog },
			{ href: '/jobseeker/profile-edit/professional', label: 'Professional', icon: UserCog },
			{ href: '/jobseeker/profile-edit/skills', label: 'Skills', icon: UserCog },
			{ href: '/jobseeker/profile-edit/certifications', label: 'Certifications', icon: UserCog },
			{ href: '/jobseeker/profile-edit/languages', label: 'Languages', icon: UserCog },
			{ href: '/jobseeker/profile-edit/publications', label: 'Publications', icon: UserCog },
			{ href: '/jobseeker/profile-edit/awards', label: 'Awards', icon: UserCog },
			{ href: '/jobseeker/profile-edit/resume', label: 'Resume', icon: UserCog },
		],
	},
	{
		href: '/jobseeker/applications',
		label: 'My Applications',
		icon: FileText,
	},
	{
		href: '/jobseeker/find-job',
		label: 'Find Job',
		icon: Search,
	},
];
