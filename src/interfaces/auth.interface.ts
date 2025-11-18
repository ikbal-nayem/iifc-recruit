import { ROLES } from '@/constants/auth.constant';
import { IFile } from './common.interface';
import { EnumDTO, IClientOrganization } from './master-data.interface';

export enum UserType {
	SYSTEM = 'SYSTEM',
	IIFC_ADMIN = 'IIFC_ADMIN',
	JOB_SEEKER = 'JOB_SEEKER',
	ORG_ADMIN = 'ORG_ADMIN',
}

export interface IAuthInfo {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
}

export interface IUser {
	id?: string;
	username: string;
	email: string;
	roles: ROLES[];
	openInterestModal?: boolean;
	userType: UserType;
	firstName: string;
	lastName: string;
	fullName?: string;
	phone?: string;
	profileImage?: IFile;
	dateOfBirth?: string;
	gender?: string;
	genderDTO?: EnumDTO;
	organizationId?: string;
	organization?: IClientOrganization;
}
