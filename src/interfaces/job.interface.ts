import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from './master-data.interface';

export enum JobRequestType {
	OUTSOURCING = 'OUTSOURCING',
	PERMANENT = 'PERMANENT',
}

export enum JobRequestStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
}

export enum JobRequestedPostStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	COMPLETED = 'COMPLETED',
}

export type RequestedPost = {
	id?: number;
	jobRequestId?: number;
	jobRequest?: JobRequest;
	postId: number;
	post?: IPost;
	vacancy: number;
	outsourcingZoneId?: number;
	outsourcingZone?: IOutsourcingZone;
	fromDate?: string;
	toDate?: string;
	salaryFrom?: number;
	salaryTo?: number;
	status?: JobRequestedPostStatus;
	statusDTO?: EnumDTO;
	experienceRequired?: number;
	negotiable?: boolean;
	yearsOfContract?: number | null;
	totalApplied?: number;
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
	type?: JobRequestType;
	typeDTO?: EnumDTO;
	status?: JobRequestStatus;
	statusDTO?: EnumDTO;
	requestedPosts: RequestedPost[];
	active?: boolean;
};
