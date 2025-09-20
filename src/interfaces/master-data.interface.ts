
import { STATUS_TYPE } from "@/constants/common.constant";
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

export interface IOrganization extends ICommonMasterData {
    fkCountry: string;
    address: string;
    fkIndustryType: string;
    fkOrganizationType: string;
    phone?: string;
    email?: string;
    website?: string;
}


export interface IStatus extends ICommonMasterData {
	statusType: typeof STATUS_TYPE[keyof typeof STATUS_TYPE];
}

