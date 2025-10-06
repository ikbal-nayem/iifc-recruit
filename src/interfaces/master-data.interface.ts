
import { STATUS_TYPE } from '@/constants/common.constant';
import { IObject } from './common.interface';

export type EnumDTO = {
	value: string;
	labelEn: string;
	labelBn: string;
};

export interface ICommonMasterData {
	id?: number;
	name: string;
	isActive: boolean;
	code?: string;
}

export interface IBilingualMasterData {
	id?: number;
	nameEn: string;
	nameBn: string;
	isActive: boolean;
}

export interface IOutsourcingCategory extends IBilingualMasterData {}

export interface IOutsourcingZone extends IBilingualMasterData {}

export interface IOutsourcingService extends IBilingualMasterData {
	categoryId: number;
	category?: IOutsourcingCategory;
}

export interface IOutsourcingCharge {
	id?: number;
	categoryId: number;
	zoneId: number;
	monthlyServiceCharge: number;
	isActive: boolean;
	category?: IOutsourcingCategory;
	zone?: IOutsourcingZone;
}


export interface IEducationInstitution extends ICommonMasterData {
	countryId: string;
	country?: IObject;
}

export interface IOrganization extends ICommonMasterData {
	countryCode: string;
	organizationTypeId: number;
	industryTypeId?: number;
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
