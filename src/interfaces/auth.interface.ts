import { IFile } from './common.interface';
import { EnumDTO } from './master-data.interface';

export enum UserType {
	'SYSTEM',
	'IIFC_ADMIN',
	'JOB_SEEKER',
	'ORG_ADMIN',
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
	roles: string[];
	userType: UserType;
	firstName: string;
	lastName: string;
	fullName?: string;
	phone?: string;
	profileImage?: IFile;
	dateOfBirth?: string;
	gender?: string;
	genderDTO?: EnumDTO;
}
