
import { ROUTES } from '@/constants/routes.constant';
import type { LucideIcon } from 'lucide-react';
import {
	Award,
	BookCopy,
	BookMarked,
	BookOpen,
	Briefcase,
	Building2,
	CheckCircle,
	Clock,
	FileText,
	FolderKanban,
	Globe,
	GraduationCap,
	Handshake,
	Heart,
	Languages,
	LayoutDashboard,
	Network,
	Play,
	PlusCircle,
	Search,
	Settings,
	Star,
	User,
	UserCircle,
	UserCog,
	Users,
	Users2,
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
		href: ROUTES.JOB_REQUESTS,
		label: 'Requests',
		icon: FolderKanban,
		isActive: (pathname) => pathname.startsWith('/admin/job-management'),
		submenu: [
			{
				href: ROUTES.JOB_REQUEST_CREATE,
				label: 'New Request',
				icon: PlusCircle,
			},
			{
				href: ROUTES.JOB_REQUEST_PENDING,
				label: 'Pending',
				icon: Clock,
			},
			{
				href: ROUTES.JOB_REQUEST_PROCESSING,
				label: 'Processing',
				icon: Play,
			},
			{
				href: ROUTES.JOB_REQUEST_COMPLETED,
				label: 'Completed',
				icon: CheckCircle,
			},
		],
	},
	{
		href: ROUTES.APPLICATIONS,
		label: 'Applications',
		icon: Users2,
		isActive: (pathname) => pathname.startsWith('/admin/application'),
		submenu: [
			{
				href: ROUTES.APPLICATION_PENDING,
				label: 'Pending',
				icon: Clock,
			},
			{
				href: ROUTES.APPLICATION_PROCESSING,
				label: 'Processing',
				icon: Play,
			},
			{
				href: ROUTES.APPLICATION_SHORTLISTED,
				label: 'Shortlisted',
				icon: CheckCircle,
			},
			{
				href: ROUTES.APPLICATION_COMPLETED,
				label: 'Completed',
				icon: CheckCircle,
			},
		],
	},
	{ href: '/admin/jobseekers', label: 'Jobseekers', icon: Users },
	{ href: ROUTES.CLIENT_ORGANIZATIONS, label: 'Client Organizations', icon: Handshake },
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
			{
				href: '/admin/master-data/company/organizations',
				label: 'Company',
				icon: Building2,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/company'),
				submenu: [
					{ href: '/admin/master-data/company/organizations', label: 'Organizations' },
					{ href: '/admin/master-data/industry-types', label: 'Industry Types' },
					{ href: '/admin/master-data/organization-types', label: 'Organization Types' },
					{ href: '/admin/master-data/position-levels', label: 'Position Levels' },
				],
			},
			{ href: '/admin/master-data/posts', label: 'Posts', icon: UserCog },
			{ href: '/admin/master-data/skills', label: 'Skills', icon: Award },
			{ href: '/admin/master-data/languages', label: 'Languages', icon: Globe },
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
				href: '/admin/master-data/training/training-types',
				label: 'Training',
				icon: BookMarked,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/training'),
				submenu: [
					{ href: '/admin/master-data/training/training-types', label: 'Training Types' },
					{ href: '/admin/master-data/training/certifications', label: 'Certifications' },
				],
			},
			{
				href: '/admin/master-data/outsourcing/outsourcing-category',
				label: 'Outsourcing',
				icon: Network,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/outsourcing'),
				submenu: [
					{ href: '/admin/master-data/outsourcing/outsourcing-category', label: 'Category' },
					{ href: '/admin/master-data/outsourcing/outsourcing-zone', label: 'Zone' },
					{ href: '/admin/master-data/outsourcing/outsourcing-charge', label: 'Charge' },
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
				icon: User,
				isActive: (pathname) => pathname === '/jobseeker/profile-edit',
			},
			{ href: '/jobseeker/profile-edit/family', label: 'Family', icon: Heart },
			{ href: '/jobseeker/profile-edit/academic', label: 'Academic', icon: GraduationCap },
			{ href: '/jobseeker/profile-edit/professional', label: 'Professional', icon: Briefcase },
			{ href: '/jobseeker/profile-edit/skills', label: 'Skills', icon: Star },
			{ href: '/jobseeker/profile-edit/certifications', label: 'Certifications', icon: BookMarked },
			{ href: '/jobseeker/profile-edit/training', label: 'Training', icon: BookCopy },
			{ href: '/jobseeker/profile-edit/languages', label: 'Languages', icon: Languages },
			{ href: '/jobseeker/profile-edit/publications', label: 'Publications', icon: BookOpen },
			{ href: '/jobseeker/profile-edit/awards', label: 'Awards', icon: Award },
			{ href: '/jobseeker/profile-edit/resume', label: 'Resume', icon: FileText },
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
