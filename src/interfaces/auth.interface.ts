import { IFile } from "./common.interface";

export type UserType = 'SYSTEM' | 'IIFC_ADMIN' | 'JOB_SEEKER' | 'CLIENT' | 'EXAMINER';

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
  profileImage?: IFile;
}
