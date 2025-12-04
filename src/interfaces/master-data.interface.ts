
import { IFile, IObject } from './common.interface';

export type EnumDTO = {
	value: string;
	nameEn: string;
	nameBn: string;
};

export interface ICommonMasterData {
	id: string;
	nameEn: string;
	nameBn: string;
	active: boolean;
	code?: string;
}

export interface IRole extends ICommonMasterData {
	roleCode: string;
	parentId?: string;
	parent?: IRole;
}

export interface IOutsourcingCategory extends ICommonMasterData {}

export interface IOutsourcingZone extends ICommonMasterData {}

export interface IPost extends ICommonMasterData {
	outsourcing?: boolean;
	outsourcingCategoryId?: string;
	outsourcingCategory?: IOutsourcingCategory;
}

export interface IOutsourcingCharge {
	id?: string;
	categoryId: string;
	zoneId: string;
	monthlyServiceCharge: number;
	active: boolean;
	category?: IOutsourcingCategory;
	zone?: IOutsourcingZone;
}

export interface IEducationInstitution extends ICommonMasterData {
	countryId?: string;
	country?: IObject;
}

export interface IClientOrganization {
	id?: string;
	nameEn: string;
	nameBn: string;
	organizationTypeId?: string;
	organizationType?: ICommonMasterData;
	clientId?: string;
	address?: string;
	contactPersonName?: string;
	contactNumber?: string;
	email?: string;
	website?: string;
	active: boolean;
	isClient?: boolean;
	isExaminer?: boolean;
	systemOwner?: boolean;
}

export interface IOrganizationUser {
	id: string;
	email: string;
	phone: string;
	organizationId: string;
	organizationNameEn: string;
	organizationNameBn: string;
	fullName: string;
	firstName: string;
	lastName: string;
	roles: string[];
	profileImage?: IFile;
	enabled: boolean;
}
