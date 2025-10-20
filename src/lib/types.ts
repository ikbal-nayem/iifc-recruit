import {
	AcademicInfo,
	Award,
	Certification,
	FamilyInfo,
	Language,
	PersonalInfo,
	ProfessionalInfo,
	Publication,
	Resume,
	Training,
} from '@/interfaces/jobseeker.interface';

export type Jobseeker = {
	id: string;
	personalInfo: PersonalInfo;
	academicInfo: AcademicInfo[];
	professionalInfo: ProfessionalInfo[];
	familyInfo: FamilyInfo;
	skills: string[];
	certifications: Certification[];
	languages: Language[];
	publications: Publication[];
	awards: Award[];
	trainings: Training[];
	resume: Resume;
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
