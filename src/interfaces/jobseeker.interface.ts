import { IFile, ProficiancyLevel } from "./common.interface";
import { ICommonMasterData } from "./master-data.interface";

export type Language = {
	id?: number;
	languageId: number;
	language?: ICommonMasterData;
	proficiency: ProficiancyLevel;
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

export type Resume = {
	id: number;
	createdOn: string;
	file: IFile;
	isActive: boolean;
};