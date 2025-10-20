
export const ROUTES = {
	HOME: '/',
	JOB_REQUESTS: '/admin/job-management/request',
	JOB_REQUEST_CREATE: '/admin/job-management/request/create',
	JOB_REQUEST_DETAILS: (id?: string) => `/admin/job-management/request/${id}`,
	JOB_REQUEST_MANAGE: (id?: string) => `/admin/job-management/request/${id}/manage`,
	JOB_REQUEST_EDIT: (id?: string) => `/admin/job-management/request/edit/${id}`,
	JOB_REQUEST_PENDING: '/admin/job-management/request/pending',
	JOB_REQUEST_PROCESSING: '/admin/job-management/request/processing',
	JOB_REQUEST_COMPLETED: '/admin/job-management/request/completed',

	APPLICATIONS: '/admin/application',
	REQUESTED_POST_DETAILS: (id?: number) => `/admin/application/${id}`,
	CLIENT_ORGANIZATIONS: '/admin/client-organizations',
	CLIENT_ORGANIZATION_DETAILS: (id?: number | string) => `/admin/client-organizations/${id}`,
};
