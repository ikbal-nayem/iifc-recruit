
import { STATUS_TYPE } from '@/constants/common.constant';
import { IObject } from './common.interface';

export type EnumDTO = {
	value: string;
	nameEn: string;
	nameBn: string;
};

export interface ICommonMasterData {
	id?: number;
	nameEn: string;
	nameBn: string;
	active: boolean;
	code?: string;
}


export interface IOutsourcingCategory extends ICommonMasterData {}

export interface IOutsourcingZone extends ICommonMasterData {}

export interface IOutsourcingService extends ICommonMasterData {
	categoryId: number;
	category?: IOutsourcingCategory;
}

export interface IOutsourcingCharge {
	id?: number;
	categoryId: number;
	zoneId: number;
	monthlyServiceCharge: number;
	active: boolean;
	category?: IOutsourcingCategory;
	zone?: IOutsourcingZone;
}


export interface IEducationInstitution extends ICommonMasterData {
	fkCountry: string;
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

export interface IClientOrganization {
    id?: number;
    nameEn: string;
    nameBn: string;
    organizationTypeId: number;
    organizationType?: ICommonMasterData;
    address?: string;
    contactPersonName?: string;
    contactNumber?: string;
    email?: string;
    website?: string;
    active: boolean;
    isClient?: boolean;
    isExaminer?: boolean;
}

export interface IOrganizationUser {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Member';
    status: 'Active' | 'Inactive';
    avatar: string;
}


export interface IStatus extends ICommonMasterData {
	statusType: typeof STATUS_TYPE[keyof typeof STATUS_TYPE];
}
