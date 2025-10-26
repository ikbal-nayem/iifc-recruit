
import { RequestedPost } from './job.interface';
import { JobseekerSearch } from './jobseeker.interface';
import { EnumDTO } from './master-data.interface';

export enum APPLICATION_STATUS {
	APPLIED = 'APPLIED',
	ACCEPTED = 'ACCEPTED',
	SHORTLISTED = 'SHORTLISTED',
	HIRED = 'HIRED',
	INTERVIEW = 'INTERVIEW',
	REJECTED = 'REJECTED',
	TERMIATED = 'TERMIATED',
}

export type Application = {
	id: string;
	status: APPLICATION_STATUS;
	statusDTO: EnumDTO;
	appliedDate: string;
	applicantId: string;
	applicant?: JobseekerSearch;
	requestedPostId: string;
	requestedPost?: RequestedPost;
	interviewTime?: string;
	marks?: number;
};
