
import { AcademicInfo, Award, Language, ProfessionalInfo, Publication, Resume, Training } from '@/interfaces/jobseeker.interface';
import { IFile } from './interfaces/common.interface';

export type UserRole = 'candidate' | 'admin';

export type Address = {
	divisionId: number;
	districtId: number;
	upazilaId: number;
	line1: string;
	upazila: string;
	district: string;
	division: string;
	postCode: number | string;
};

export type PersonalInfo = {
    // Basic Info
	firstName: string;
	middleName?: string;
	lastName: string;
	fatherName: string;
	motherName: string;
	dateOfBirth: string;
	gender: string;
	nationality: string;
	careerObjective?: string; // Replaces headline

    // User Info (nested)
    user: {
        email: string;
        phone: string;
    }

    // Identity
	nid?: string;
	passportNo?: string;
	birthCertificate?: string;

    // Status
	maritalStatus: string;
	religion?: string;
	professionalStatus?: string;

    // Address
	presentDivisionId?: number;
	presentDistrictId?: number;
	presentUpazilaId?: number;
	presentAddress?: string;
	presentPostCode?: number;
	sameAsPresentAddress?: boolean;
	permanentDivisionId?: number;
	permanentDistrictId?: number;
	permanentUpazilaId?: number;
	permanentAddress?: string;
	permanentPostCode?: number;

    // Socials
	linkedInProfile?: string;
	videoProfile?: string;
    
    // Media
	profileImage?: IFile;
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
