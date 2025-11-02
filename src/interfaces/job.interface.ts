
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from './master-data.interface';

export enum JobRequestType {
	OUTSOURCING = 'OUTSOURCING',
	PERMANENT = 'PERMANENT',
}

export enum JobRequestStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	SHORTLISTED = 'SHORTLISTED',
	COMPLETED = 'COMPLETED',
}

export enum JobRequestedPostStatus {
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	SHORTLISTED = 'SHORTLISTED',
	COMPLETED = 'COMPLETED',
	PUBLISHED = 'PUBLISHED',
}

export type RequestedPost = {
	id?: string;
	jobRequestId?: string;
	jobRequest?: JobRequest;
	postId: string;
	post?: IPost;
	vacancy: number;
	outsourcingZoneId?: string;
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
	examinerId?: string;
	examiner?: IClientOrganization;
	circularPublishDate?: string;
	circularEndDate?: string;
	jobDescription?: string;
	jobResponsibilities?: string;
	jobRequirements?: string;
};

export type JobRequest = {
	id?: string;
	memoNo: string;
	clientOrganizationId: string;
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
