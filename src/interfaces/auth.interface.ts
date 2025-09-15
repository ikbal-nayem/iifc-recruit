export interface IAuthInfo {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
}