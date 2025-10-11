export type RequestedPost = {
	id?: number;
	postId: number;
	vacancy: number;
	outsourcingZoneId?: number;
	fromDate?: string;
	toDate?: string;
	salaryFrom?: number;
	salaryTo?: number;
};

export type JobRequest = {
	id?: string;
	memoNo: string;
	clientOrganizationId: number;
	clientOrganization?: string;
	subject: string;
	description?: string;
	requestDate: string;
	deadline: string;
	type: 'OUTSOURCING' | string;
	status?: 'Pending' | 'Approved' | 'Rejected';
	requestedPosts: RequestedPost[];
};