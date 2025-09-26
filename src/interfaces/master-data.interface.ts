
import { STATUS_TYPE } from "@/constants/common.constant";
import { IObject } from "./common.interface";

export interface ICommonMasterData {
	id?: number;
	name: string;
	isActive: boolean;
	code?: string;
}

export interface IEducationInstitution extends ICommonMasterData {
	countryId: string;
	country?: IObject;
}

export interface IOrganization extends ICommonMasterData {
    countryCode: string;
    organizationTypeId: string;
    industryTypeId?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    
    country?: ICommonMasterData;
    organizationType?: ICommonMasterData;
    industryType?: ICommonMasterData;
}


export interface IStatus extends ICommonMasterData {
	statusType: typeof STATUS_TYPE[keyof typeof STATUS_TYPE];
}
