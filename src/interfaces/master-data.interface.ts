import { IObject } from "./common.interface";

export interface ICommonMasterData {
	id?: string;
	name: string;
	isActive: boolean;
}

export interface IEducationInstitution extends ICommonMasterData {
	countryId: string;
	country?: IObject;
}
