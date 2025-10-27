import { IFile } from "./common.interface";

export type UserType = 'SYSTEM' | 'IIFC_ADMIN' | 'JOB_SEEKER' | 'CLIENT' | 'EXAMINER';

export interface IAuthInfo {
  accessToken: string;
  refreshToken: string;
  username: string;
  userType: UserType;
  roles: string[];
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
