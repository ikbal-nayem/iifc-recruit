import { EnumDTO, IClientOrganization, IPost } from "./master-data.interface";

export type RequestedPost = {
	id?: number;
	postId: number;
    post?: IPost;
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
	clientOrganization?: IClientOrganization;
	subject: string;
	description?: string;
	requestDate: string;
	deadline: string;
	requestType: 'OUTSOURCING' | string;
    requestTypeDTO?: EnumDTO;
	status?: 'Pending' | 'Approved' | 'Rejected';
    statusDTO?: EnumDTO;
	requestedPosts: RequestedPost[];
};
