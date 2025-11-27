import { IFile, ResultSystem } from './common.interface';
import { EnumDTO, ICommonMasterData, IEducationInstitution, IPost } from './master-data.interface';

export enum ProficiencyLevel {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
	EXPERT = 'EXPERT',
}

export type JobseekerSkill = {
	id?: string;
	skillId: string;
	skill?: ICommonMasterData;
	yearsOfExperience: number;
	proficiency: string;
	proficiencyDTO?: EnumDTO;
};

export type Language = {
	id?: string;
	languageId: string;
	language?: ICommonMasterData;
	proficiency: string;
	proficiencyDTO?: EnumDTO;
};

export type Publication = {
	id?: string;
	title: string;
	publisher: string;
	publicationDate: string;
	url: string;
};

export type Award = {
	id?: string;
	name: string;
	description: string;
	date: string;
};

export type Training = {
	id?: string;
	name: string;
	institutionName: string;
	trainingTypeId?: string;
	trainingType?: ICommonMasterData;
	startDate: string;
	endDate: string;
	certificateFile?: IFile | File;
};

export type Certification = {
	id?: string;
	certification?: ICommonMasterData;
	certificationId?: string;
	issuingAuthority: string;
	examDate?: string;
	issueDate?: string;
	expireDate?: string;
	score?: string;
	outOf?: string;
	certificateFile?: IFile | File;
};

export type AcademicInfo = {
	id?: string;
	degreeLevel: ICommonMasterData;
	// domain: ICommonMasterData;
	domainNameEn: string;
	domainNameBn: string;
	institution: IEducationInstitution;
	degreeTitle: string;
	resultSystem: ResultSystem;
	resultAchieved?: string;
	cgpa?: number;
	outOfCgpa?: number;
	passingYear: string;
	duration?: number;
	certificateFile?: IFile | File;
};

export type ProfessionalInfo = {
	id?: string;
	positionTitle: string;
	organizationNameEn: string;
	organizationNameBn?: string;
	responsibilities: string;
	joinDate: string;
	resignDate?: string;
	isCurrent: boolean;
	salary?: number;
	salaryCurrency?: 'BDT' | 'USD';
	referenceName?: string;
	referenceEmail?: string;
	referencePhone?: string;
	referencePostDept?: string;
	certificateFile?: IFile | File;
};

export type Resume = {
	id: string;
	createdOn: string;
	file: IFile;
	isActive: boolean;
};

export type ChildInfo = {
	id?: string;
	name: string;
	gender: string;
	genderDTO?: EnumDTO;
	dob: string;
	serialNo: number;
};

export type FamilyInfo = {
	id?: string;
	name: string;
	profession: string;
	ownDistrictId?: string;
	status?: string;
	children: ChildInfo[];
};

export type PersonalInfo = {
	id?: string;
	// Basic Info
	fullName?: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	fatherName: string;
	motherName: string;
	dateOfBirth: string;
	gender: string;
	genderDTO?: EnumDTO;
	nationality: string;
	careerObjective?: string;

	email: string;
	phone: string;

	nid?: string;
	passportNo?: string;
	birthCertificate?: string;

	// Status
	maritalStatus: string;
	maritalStatusDTO?: EnumDTO;
	spouseName?: string;
	religion?: string;
	religionDTO?: EnumDTO;
	professionalStatus?: string;
	professionalStatusDTO?: EnumDTO;

	// Address
	presentDivisionId?: string;
	presentDistrictId?: string;
	presentUpazilaId?: string;
	presentAddress?: string;
	presentPostCode?: number;
	sameAsPermanentAddress?: boolean;
	permanentDivisionId?: string;
	permanentDistrictId?: string;
	permanentUpazilaId?: string;
	permanentAddress?: string;
	permanentPostCode?: number;

	presentDivision?: ICommonMasterData;
	presentDistrict?: ICommonMasterData;
	presentUpazila?: ICommonMasterData;
	permanentDivision?: ICommonMasterData;
	permanentDistrict?: ICommonMasterData;
	permanentUpazila?: ICommonMasterData;

	// Socials
	linkedInProfile?: string;
	videoProfile?: string;

	// Media
	profileImage?: IFile;
};

export interface IInterestedIn {
	id?: string;
	postId: string;
	post?: IPost;
}

export type Jobseeker = {
	id?: string;
	personalInfo: PersonalInfo;
	// spouse?: FamilyInfo;
	// children?: ChildInfo[];
	interestIn?: IInterestedIn[];
	education: AcademicInfo[];
	experiences: ProfessionalInfo[];
	certifications: Certification[];
	trainings: Training[];
	languages: Language[];
	publications: Publication[];
	awards: Award[];
	skills: JobseekerSkill[];
	resume: Resume;
};

export interface IProfileCompletionStatus {
	completionPercentage: number;
	formCompletionStatus: {
		form: string;
		isComplete: boolean;
	}[];
}

export type JobseekerSearch = {
	userId: string;
	firstName: string;
	lastName: string;
	middleName: string;
	fullName: string;
	passportNo: string;
	email: string;
	phone: string;
	profileImage?: IFile;
	organizationId?: string;
	organizationNameEn?: string;
	organizationNameBn?: string;
};
