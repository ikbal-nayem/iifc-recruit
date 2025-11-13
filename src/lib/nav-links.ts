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
	History,
	Languages,
	LayoutDashboard,
	Network,
	Play,
	PlusCircle,
	Search,
	Settings,
	Shield,
	Star,
	User,
	UserCircle,
	UserCog,
	Users,
	Users2,
	CalendarCheck,
} from 'lucide-react';
import type { NavPermission } from '@/config/access.config';

export interface NavLink {
	key: NavPermission | string; // Unique key for permission mapping
	href: string;
	label: string;
	icon?: LucideIcon;
	separator?: boolean;
	isActive?: (pathname: string, hash?: string) => boolean;
	submenu?: NavLink[];
	inHeader?: boolean;
	sidebar?: boolean;
}

export const adminNavLinks: NavLink[] = [
	{
		key: 'DASHBOARD',
		href: ROUTES.DASHBOARD.ADMIN,
		label: 'Dashboard',
		icon: LayoutDashboard,
		isActive: (pathname) => pathname === ROUTES.DASHBOARD.ADMIN,
	},
	{
		key: 'REQUESTS',
		href: ROUTES.JOB_REQUEST.LIST,
		label: 'Requests',
		icon: FolderKanban,
		isActive: (pathname) => pathname.startsWith(ROUTES.JOB_REQUEST.LIST),
		submenu: [
			{
				key: 'REQUESTS_NEW',
				href: ROUTES.JOB_REQUEST.CREATE,
				label: 'New Request',
				icon: PlusCircle,
			},
			{
				key: 'REQUESTS_PENDING',
				href: ROUTES.JOB_REQUEST.PENDING,
				label: 'Pending',
				icon: History,
			},
			{
				key: 'REQUESTS_PROCESSING',
				href: ROUTES.JOB_REQUEST.PROCESSING,
				label: 'Processing',
				icon: Briefcase,
			},
			{
				key: 'REQUESTS_COMPLETED',
				href: ROUTES.JOB_REQUEST.COMPLETED,
				label: 'Completed',
				icon: CheckCircle,
			},
		],
	},
	{
		key: 'APPLICATIONS',
		href: ROUTES.APPLICATIONS,
		label: 'Applications',
		icon: Users2,
		isActive: (pathname) => pathname.startsWith(ROUTES.APPLICATIONS),
		submenu: [
			{
				key: 'APPLICATIONS_PENDING',
				href: ROUTES.APPLICATION_PENDING,
				label: 'Pending',
				icon: Clock,
			},
			{
				key: 'APPLICATIONS_PROCESSING',
				href: ROUTES.APPLICATION_PROCESSING,
				label: 'Processing',
				icon: Play,
			},
			{
				key: 'APPLICATIONS_SHORTLISTED',
				href: ROUTES.APPLICATION_SHORTLISTED,
				label: 'Shortlisted',
				icon: CalendarCheck,
			},
		],
	},
	{ key: 'JOBSEEKERS', href: '/admin/jobseekers', label: 'Jobseekers', icon: Users },
	{ key: 'CLIENT_ORGANIZATIONS', href: ROUTES.CLIENT_ORGANIZATIONS, label: 'Client Organizations', icon: Handshake },
	{
		key: 'USER_MANAGEMENT',
		href: '/admin/user-management',
		label: 'User Management',
		icon: UserCog,
	},
	{
		key: 'PROFILE',
		href: '/admin/profile',
		label: 'My Profile',
		icon: UserCircle,
		inHeader: true,
		sidebar: false,
	},
	{
		key: 'CHANGE_PASSWORD',
		href: '/admin/change-password',
		label: 'Change Password',
		icon: Shield,
		inHeader: true,
		sidebar: false,
	},
	{
		key: 'SEPARATOR_1',
		href: '#',
		label: 'Separator',
		icon: Users,
		separator: true,
	},
	{
		key: 'MASTER_DATA',
		href: '#',
		label: 'Master Data',
		icon: Settings,
		isActive: (pathname) => pathname.startsWith('/admin/master-data'),
		submenu: [
			{
				key: 'MASTER_DATA_ORG_TYPES',
				href: '/admin/master-data/organization-types',
				label: 'Organization Types',
				icon: Building2,
			},
			{ key: 'MASTER_DATA_POSTS', href: '/admin/master-data/posts', label: 'Posts', icon: UserCog },
			{ key: 'MASTER_DATA_SKILLS', href: '/admin/master-data/skills', label: 'Skills', icon: Award },
			{ key: 'MASTER_DATA_LANGUAGES', href: '/admin/master-data/languages', label: 'Languages', icon: Globe },
			{
				key: 'MASTER_DATA_EDUCATION',
				href: '/admin/master-data/education',
				label: 'Education',
				icon: GraduationCap,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/education'),
				submenu: [
					{
						key: 'MASTER_DATA_EDUCATION_DEGREE_LEVELS',
						href: '/admin/master-data/education/degree-levels',
						label: 'Degree Levels',
					},
					{
						key: 'MASTER_DATA_EDUCATION_INSTITUTIONS',
						href: '/admin/master-data/education/institutions',
						label: 'Institutions',
					},
				],
			},
			{
				key: 'MASTER_DATA_TRAINING',
				href: '/admin/master-data/training/training-types',
				label: 'Training',
				icon: BookMarked,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/training'),
				submenu: [
					{
						key: 'MASTER_DATA_TRAINING_CERTIFICATIONS',
						href: '/admin/master-data/training/certifications',
						label: 'Certifications',
					},
				],
			},
			{
				key: 'MASTER_DATA_OUTSOURCING',
				href: '/admin/master-data/outsourcing/outsourcing-category',
				label: 'Outsourcing',
				icon: Network,
				isActive: (pathname) => pathname.startsWith('/admin/master-data/outsourcing'),
				submenu: [
					{
						key: 'MASTER_DATA_OUTSOURCING_CATEGORY',
						href: '/admin/master-data/outsourcing/outsourcing-category',
						label: 'Category',
					},
					{ key: 'MASTER_DATA_OUTSOURCING_ZONE', href: '/admin/master-data/outsourcing/outsourcing-zone', label: 'Zone' },
					{
						key: 'MASTER_DATA_OUTSOURCING_CHARGE',
						href: '/admin/master-data/outsourcing/outsourcing-charge',
						label: 'Charge',
					},
				],
			},
		],
	},
];

export const jobseekerNavLinks: NavLink[] = [
	{
		key: 'DASHBOARD',
		href: ROUTES.DASHBOARD.JOB_SEEKER,
		label: 'Dashboard',
		icon: LayoutDashboard,
		isActive: (pathname) => pathname === ROUTES.DASHBOARD.JOB_SEEKER,
	},
	{
		key: 'PROFILE_VIEW',
		href: '/jobseeker/profile-view',
		label: 'My Profile',
		icon: UserCircle,
	},
	{
		key: 'PROFILE_EDIT',
		href: '/jobseeker/profile-edit',
		label: 'Edit Profile',
		icon: UserCog,
		isActive: (pathname) => pathname.startsWith('/jobseeker/profile-edit'),
		submenu: [
			{
				key: 'PROFILE_EDIT_PERSONAL',
				href: '/jobseeker/profile-edit',
				label: 'Personal Info',
				icon: User,
				isActive: (pathname) => pathname === '/jobseeker/profile-edit',
			},
			{ key: 'PROFILE_EDIT_FAMILY', href: '/jobseeker/profile-edit/family', label: 'Family', icon: Heart },
			{
				key: 'PROFILE_EDIT_ACADEMIC',
				href: '/jobseeker/profile-edit/academic',
				label: 'Academic',
				icon: GraduationCap,
			},
			{
				key: 'PROFILE_EDIT_PROFESSIONAL',
				href: '/jobseeker/profile-edit/professional',
				label: 'Professional',
				icon: Briefcase,
			},
			{ key: 'PROFILE_EDIT_SKILLS', href: '/jobseeker/profile-edit/skills', label: 'Skills', icon: Star },
			{
				key: 'PROFILE_EDIT_CERTIFICATIONS',
				href: '/jobseeker/profile-edit/certifications',
				label: 'Certifications',
				icon: BookMarked,
			},
			{ key: 'PROFILE_EDIT_TRAINING', href: '/jobseeker/profile-edit/training', label: 'Training', icon: BookCopy },
			{
				key: 'PROFILE_EDIT_LANGUAGES',
				href: '/jobseeker/profile-edit/languages',
				label: 'Languages',
				icon: Languages,
			},
			{
				key: 'PROFILE_EDIT_PUBLICATIONS',
				href: '/jobseeker/profile-edit/publications',
				label: 'Publications',
				icon: BookOpen,
			},
			{ key: 'PROFILE_EDIT_AWARDS', href: '/jobseeker/profile-edit/awards', label: 'Awards', icon: Award },
			{ key: 'PROFILE_EDIT_RESUME', href: '/jobseeker/profile-edit/resume', label: 'Resume', icon: FileText },
		],
	},
	{
		key: 'MY_APPLICATIONS',
		href: '/jobseeker/applications',
		label: 'My Applications',
		icon: FileText,
	},
	{
		key: 'FIND_JOB',
		href: '/jobseeker/find-job',
		label: 'Find Job',
		icon: Search,
	},
	{
		key: 'CHANGE_PASSWORD',
		href: '/jobseeker/change-password',
		label: 'Change Password',
		icon: Shield,
		inHeader: true,
		sidebar: false,
	},
];
