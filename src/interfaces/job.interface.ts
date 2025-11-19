
import { IFile } from './common.interface';
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
	CIRCULAR_PUBLISHED = 'CIRCULAR_PUBLISHED',
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
	invitationLetter?: IFile;
	acceptanceLetter?: IFile;
	financialProposal?: IFile;
	technicalProposal?: IFile;
	noa?: IFile;
	contractPaper?: IFile;
};

export interface ICircular {
	id: string;
	jobRequestType: string;
	jobDescription: string;
	jobRequirements: string;
	jobResponsibilities: string;
	vacancy: number;
	postId: string;
	postNameEn: string;
	postNameBn: string;
	outsourcingCategoryId?: string;
	outsourcingCategoryNameEn?: string;
	outsourcingCategoryNameBn?: string;
	clientOrganizationId: string;
	clientOrganizationNameEn: string;
	clientOrganizationNameBn: string;
	outsourcingZoneId?: string;
	outsourcingZoneNameEn?: string;
	outsourcingZoneNameBn?: string;
	circularPublishDate: string;
	circularEndDate: string;
	salaryFrom?: number;
	salaryTo?: number;
	applied: boolean;
}
