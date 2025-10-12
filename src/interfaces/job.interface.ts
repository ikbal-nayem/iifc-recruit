
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from './master-data.interface';

export enum JobRequestStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	SUCCESS = 'SUCCESS',
}

export enum JobRequestType {
	OUTSOURCING = 'OUTSOURCING',
	PERMANENT = 'PERMANENT',
}

export type RequestedPost = {
	id?: number;
	postId: number;
	post?: IPost;
	vacancy: number;
	outsourcingZoneId?: number;
	outsourcingZone?: IOutsourcingZone;
	fromDate?: string;
	toDate?: string;
	salaryFrom?: number;
	salaryTo?: number;
	status?: 'PENDING' | 'IN_PROGRESS' | 'EXAM' | 'INTERVIEW';
	statusDTO?: EnumDTO;
	experienceRequired?: number;
	negotiable?: boolean;
	yearsOfContract?: number | null;
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
	type?: 'OUTSOURCING' | 'PERMANENT' | string;
	typeDTO?: EnumDTO;
	status?: JobRequestStatus;
	statusDTO?: EnumDTO;
	requestedPosts: RequestedPost[];
	active?: boolean;
};
