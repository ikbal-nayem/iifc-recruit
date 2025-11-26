export const ROUTES = {
	AUTH: {
		LOGIN: '/login',
		SIGNUP: '/signup',
		FORGOT_PASSWORD: '/forgot-password',
		RESET_PASSWORD: '/reset-password',
	},

	DASHBOARD: {
		ADMIN: '/admin',
		JOB_SEEKER: '/jobseeker',
	},

	JOB_SEEKER: {
		APPLICATIONS: '/jobseeker/applications',
		PROFILE: '/jobseeker/profile-view',
		PROFILE_EDIT: {
			PERSONAL: '/jobseeker/profile-edit',
			ACADEMIC: '/jobseeker/profile-edit/academic',
			PROFESSIONAL: '/jobseeker/profile-edit/professional',
			INTEREST: '/jobseeker/profile-edit/interest',
			SKILLS: '/jobseeker/profile-edit/skills',
			CERTIFICATIONS: '/jobseeker/profile-edit/certifications',
			TRAINING: '/jobseeker/profile-edit/training',
			LANGUAGES: '/jobseeker/profile-edit/languages',
			PUBLICATIONS: '/jobseeker/profile-edit/publications',
			AWARDS: '/jobseeker/profile-edit/awards',
			RESUME: '/jobseeker/profile-edit/resume',
		},
		FIND_JOBS: '/jobseeker/find-job',
		JOB_DETAILS: (id?: string) => `/jobseeker/find-job/${id}`,
	},

	JOB_REQUEST: {
		LIST: '/admin/request',
		CREATE: '/admin/request/create',
		EDIT: (id?: string) => `/admin/request/edit/${id}`,
		PENDING: '/admin/request/pending',
		PENDING_DETAILS: (id?: string) => `/admin/request/pending/${id}`,
		PROCESSING: '/admin/request/processing',
		PROCESSING_DETAILS: (id?: string) => `/admin/request/processing/${id}`,
		COMPLETED: '/admin/request/completed',
		COMPLETED_DETAILS: (id?: string) => `/admin/request/completed/${id}`,
	},

	APPLICATIONS: '/admin/application',
	APPLICATION_PENDING: '/admin/application/pending',
	APPLICATION_PROCESSING: '/admin/application/processing',
	APPLICATION_SHORTLISTED: '/admin/application/shortlisted',
	APPLICATION_COMPLETED: '/admin/application/completed',
	MANAGE_PENDING_APPLICATION: (id?: string) => `/admin/application/pending/${id}`,
	MANAGE_PROCESSING_APPLICATION: (id?: string) => `/admin/application/processing/${id}`,
	MANAGE_SHORTLISTED_APPLICATION: (id?: string) => `/admin/application/shortlisted/${id}`,

	CLIENT_ORGANIZATIONS: '/admin/client-organizations',
	CLIENT_ORGANIZATION_DETAILS: (id?: string | string) => `/admin/client-organizations/${id}`,

	JOB_SEEKERS: '/admin/jobseekers',
};
