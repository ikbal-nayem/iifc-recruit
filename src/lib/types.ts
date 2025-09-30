
import { Award, Language, Publication, Resume, Training } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData, IEducationInstitution, IOrganization } from '@/interfaces/master-data.interface';
import { IFile } from './common.interface';

export type UserRole = 'candidate' | 'admin';

export type Address = {
	line1: string;
	upazila: string;
	district: string;
	division: string;
	postCode: string;
};

export type PersonalInfo = {
	firstName: string;
	middleName?: string;
	lastName: string;
	name: string; // Concatenation of first, middle, last
	fatherName: string;
	motherName: string;
	email: string;
	phone: string;

	dateOfBirth: string;
	gender: 'Male' | 'Female' | 'Other';
	maritalStatus: 'Single' | 'Married' | 'Widow' | 'Divorce';
	nationality: string;

	nid?: string;
	passportNo?: string;
	birthCertificate?: string;

	presentAddress: Address;
	permanentAddress: Address;

	avatar: string;
	headline: string;

	linkedInProfile?: string;
	videoProfile?: string;
};

export enum ResultSystem {
	GRADE = 'G',
	DIVISION = 'D',
	CLASS = 'C',
}

export type AcademicInfo = {
	id?: string;
	degreeLevel: ICommonMasterData;
	domain: ICommonMasterData;
	institution: IEducationInstitution;
	degreeTitle: string;
	specializationArea?: string;
	resultSystem: ResultSystem;
	resultAchieved?: string;
	cgpa?: number;
	outOfCgpa?: number;
	passingYear: string;
	duration?: number;
	achievement?: string;
	certificateFile?: IFile | File;
};

export type ProfessionalInfo = {
	id?: string;
	positionTitle: string;
	positionLevel?: ICommonMasterData;
	positionLevelId: number;
	organization?: IOrganization;
	organizationId: number;
	responsibilities: string;
	joinDate: string;
	resignDate?: string;
	isCurrent: boolean;
	salary?: number;
	salaryCurrency?: string;
	referenceName?: string;
	referenceEmail?: string;
	referencePhone?: string;
	referencePostDept?: string;
	certificateFile?: IFile | File;
};

export type Certification = {
	id?: string;
	name: string;
	issuingOrganization: string;
	issueDate: string;
	proofUrl?: string;
};

export type Candidate = {
	id: string;
	personalInfo: PersonalInfo;
	academicInfo: AcademicInfo[];
	professionalInfo: ProfessionalInfo[];
	skills: string[];
	certifications: Certification[];
	languages: Language[];
	publications: Publication[];
	awards: Award[];
	trainings: Training[];
	resumes: Resume[];
	status: 'Active' | 'Passive' | 'Hired';
};

export type Job = {
	id: string;
	title: string;
	department: string;
	location: string;
	type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
	salaryRange: string;
	description: string;
	responsibilities: string[];
	requirements: string[];
	status: 'Open' | 'Closed' | 'Archived';
	postedDate: string;
	applicationDeadline: string;
};

export type Application = {
	id: string;
	jobId: string;
	candidateId: string;
	status: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected' | 'Hired' | 'Shortlisted';
	applicationDate: string;
};

export type Activity = {
	id: string;
	user: {
		name: string;
		avatar: string;
	};
	action: string;
	target: string;
	timestamp: string;
};

