
import { JobseekerSearch } from "./jobseeker.interface";

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
	jobId: string;
	jobseekerId: string;
	status: APPLICATION_STATUS;
	applicationDate: string;
    applicantId: string;
    applicant?: JobseekerSearch
};
