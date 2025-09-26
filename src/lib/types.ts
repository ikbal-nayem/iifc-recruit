
import { Publication } from "@/app/(auth)/jobseeker/profile-edit/publications/page";
import { Language } from "@/interfaces/jobseeker.interface";

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

export type AcademicInfo = {
	id?: string;
	degree: string;
	institution: string;
	graduationYear: number;
	certificateUrls?: string[];
};

export type ProfessionalInfo = {
	id?: string;
	company: string;
	role: string;
	fromDate: string;
	toDate?: string;
	isPresent: boolean;
	responsibilities: string[];
	documentUrls?: string[];
};

export type Certification = {
	id?: string;
	name: string;
	issuingOrganization: string;
	issueDate: string;
	proofUrl?: string;
};

export type Award = {
	id?: string;
	name: string;
	awardingBody: string;
	dateReceived: string;
};

export type Training = {
	id?: string;
	trainingName: string;
	institutionName: string;
	trainingTypeId: string;
	startDate: string;
	endDate: string;
	certificateUrl?: string;
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
	resumeUrl?: string;
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
