

import { STATUS_TYPE } from '@/constants/common.constant';
import { IObject } from './common.interface';

export type EnumDTO = {
	value: string;
	nameEn: string;
	nameBn: string;
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


export interface IEducationInstitution extends IBilingualMasterData {
	countryId: string;
	country?: IObject;
}

export interface IOrganization extends IBilingualMasterData {
	countryCode: string;
	organizationTypeId: number;
	industryTypeId?: number;
	address?: string;
	phone?: string;
	email?: string;
	website?: string;

	country?: ICommonMasterData;
	organizationType?: IBilingualMasterData;
	industryType?: IBilingualMasterData;
}

export interface IClientOrganization {
    id?: number;
    nameEn: string;
    nameBn: string;
    organizationTypeId: number;
    organizationType?: IBilingualMasterData;
    address?: string;
    contactPersonName?: string;
    contactNumber?: string;
    email?: string;
    website?: string;
    isActive: boolean;
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


export interface IStatus extends IBilingualMasterData {
	statusType: typeof STATUS_TYPE[keyof typeof STATUS_TYPE];
}
