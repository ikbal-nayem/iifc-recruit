import { ICommonMasterData } from "./master-data.interface";

export enum ProficiancyLevel {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
	NATIVE = 'NATIVE',
}

export type Language = {
	id?: number;
	languageId: number;
	language?: ICommonMasterData;
	proficiency: ProficiancyLevel;
};
