import type { LucideIcon } from 'lucide-react';
import {
	Award,
	BookCopy,
	BookMarked,
	Briefcase,
	Building2,
	FileText,
	Globe,
	GraduationCap,
	Handshake,
	LayoutDashboard,
	ListChecks,
	Network,
	PlusCircle,
	Search,
	Settings,
	Tag,
	UserCircle,
	UserCog,
	Users,
} from 'lucide-react';

export interface NavLink {
	href: string;
	label: string;
	icon?: LucideIcon;
	separator?: boolean;
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
		href: '/admin/job-management',
		label: 'Job Management',
		icon: Briefcase,
		isActive: (pathname) => pathname.startsWith('/admin/job-management'),
		submenu: [
			{
				href: '/admin/job-management',
				label: 'All Jobs',
				icon: Briefcase,
				isActive: (pathname) =>
					/^\/admin\/job-management(\/[^/]+\/(applicants|edit))?$/.test(pathname) ||
					pathname === '/admin/job-management',
			},
			{
				href: '/admin/job-management/create',
				label: 'Create New',
				icon: PlusCircle,
			},
		],
	},
	{ href: '/admin/jobseekers', label: 'Jobseekers', icon: Users },
	{ href: '/admin/our-clients', label: 'Our Clients', icon: Handshake },
	{
		href: '#',
		label: 'Separator',
		icon: Users, // Icon is not used, but required by type
		separator: true,
	},
	{
		href: '#',
		label: 'Master Data',
		icon: Settings,
		isActive: (pathname) => pathname.startsWith('/admin/master-data'),
		submenu: [
			{ href: '/admin/master-data/organizations', label: 'Organizations', icon: Building2 },
			{ href: '/admin/master-data/skills', label: 'Skills', icon: Award },
			{ href: '/admin/master-data/languages', label: 'Languages', icon: Globe },
			{
				href: '#',
				label: 'Statuses',
				icon: ListChecks,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/statuses'),
				submenu: [
					{ href: '/admin/master-data/statuses/job-statuses', label: 'Job Statuses' },
					{
						href: '/admin/master-data/statuses/application-statuses',
						label: 'Application Statuses',
					},
				],
			},
			{
				href: '/admin/master-data/education/degree-levels',
				label: 'Education',
				icon: GraduationCap,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/education'),
				submenu: [
					{ href: '/admin/master-data/education/degree-levels', label: 'Degree Levels' },
					{ href: '/admin/master-data/education/domains', label: 'Domains' },
					{ href: '/admin/master-data/education/institutions', label: 'Institutions' },
				],
			},
			{
				href: '#',
				label: 'Company Data',
				icon: Network,
				isActive: (pathname) =>
					pathname.startsWith('/admin/master-data/industry-types') ||
					pathname.startsWith('/admin/master-data/organization-types') ||
					pathname.startsWith('/admin/master-data/position-levels'),
				submenu: [
					{ href: '/admin/master-data/industry-types', label: 'Industry Types' },
					{ href: '/admin/master-data/organization-types', label: 'Organization Types' },
					{ href: '/admin/master-data/position-levels', label: 'Position Levels' },
				],
			},
			{
				href: '/admin/master-data/training/training-types',
				label: 'Training',
				icon: BookMarked,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/training'),
				submenu: [
					{ href: '/admin/master-data/training/training-types', label: 'Training Types' },
					{ href: '/admin/master-data/training/certifications', label: 'Certifications' },
				],
			},
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
