
import { EnumDTO, IClientOrganization, IOutsourcingZone, IPost } from './master-data.interface';

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
	yearsOfContract?: number;
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
	type?: 'OUTSOURCING' | 'PERMANENT';
	typeDTO?: EnumDTO;
	status?: 'Pending' | 'IN_PROGRESS' | 'Success';
	statusDTO?: EnumDTO;
	requestedPosts: RequestedPost[];
	active?: boolean;
};
