import { ProficiancyLevel } from "./common.interface";
import { ICommonMasterData } from "./master-data.interface";

export type Language = {
	id?: number;
	languageId: number;
	language?: ICommonMasterData;
	proficiency: ProficiancyLevel;
};

export type Award = {
	id?: number;
	name: string;
	description: string;
	date: string;
};