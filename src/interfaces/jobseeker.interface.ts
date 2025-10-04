
import { IFile, ResultSystem } from './common.interface';
import { ICommonMasterData, IEducationInstitution, IOrganization } from './master-data.interface';

export type Language = {
	id?: number;
	languageId: number;
	language?: ICommonMasterData;
	proficiency: string;
};

export type Publication = {
	id?: string;
	title: string;
	publisher: string;
	publicationDate: string;
	url: string;
};

export type Award = {
	id?: number;
	name: string;
	description: string;
	date: string;
};

export type Training = {
	id?: number;
	name: string;
	institutionName: string;
	trainingTypeId?: number;
	trainingType?: ICommonMasterData;
	startDate: string;
	endDate: string;
	certificateFile?: IFile | File;
};

export type Certification = {
	id?: number;
	certification?: ICommonMasterData;
	certificationId?: number;
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
	salaryCurrency?: 'BDT' | 'USD';
	referenceName?: string;
	referenceEmail?: string;
	referencePhone?: string;
	referencePostDept?: string;
	certificateFile?: IFile | File;
};

export type Resume = {
	id: number;
	createdOn: string;
	file: IFile;
	isActive: boolean;
};

export type ChildInfo = {
	id?: number;
	name: string;
	gender: string;
	genderDTO?: {
		label: string;
		value: string;
	};
	dob: string;
	serialNo: number;
};

export type FamilyInfo = {
	id?: number;
	name: string;
	profession: string;
	ownDistrictId?: number;
	status?: string;
	children: ChildInfo[];
};

export type EnumDTO = {
	label: string;
	value: string;
};

export type PersonalInfo = {
	id?: number;
	// Basic Info
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
	religion?: string;
	religionDTO?: EnumDTO;
	professionalStatus?: string;
	professionalStatusDTO?: EnumDTO;

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

export type Jobseeker = {
	id?: string;
	personalInfo: PersonalInfo;
	spouse?: FamilyInfo;
	children?: ChildInfo[];
	education: AcademicInfo[];
	experiences: ProfessionalInfo[];
	certifications: Certification[];
	trainings: Training[];
	languages: Language[];
	publications: Publication[];
	awards: Award[];
	skills: ICommonMasterData[];
	resume: Resume;
};
