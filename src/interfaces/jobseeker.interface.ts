
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
	salaryCurrency?: "BDT" | "USD";
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
