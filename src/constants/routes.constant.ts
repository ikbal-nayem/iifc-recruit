
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
		PROFILE: '/jobseeker/profile',
		FIND_JOBS: '/jobseeker/find-job',
		JOB_DETAILS: (id?: string) => `/jobseeker/find-job/${id}`,
	},
	
	HOME: '/',
	JOB_REQUESTS: '/admin/request',
	JOB_REQUEST_CREATE: '/admin/request/create',
	JOB_REQUEST_DETAILS: (id?: string) => `/admin/request/${id}`,
	JOB_REQUEST_EDIT: (id?: string) => `/admin/request/edit/${id}`,
	JOB_REQUEST_PENDING: '/admin/request/pending',
	JOB_REQUEST_PROCESSING: '/admin/request/processing',
	JOB_REQUEST_COMPLETED: '/admin/request/completed',

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
