import { axiosIns } from '@/config/api.config';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { IApiResponse, IObject } from '@/interfaces/common.interface';

export const AuthService = {
	login: async (payload: IObject): Promise<IApiResponse<IAuthInfo>> =>
		await axiosIns.post('/api/auth/login', payload),

	refreshToken: async (payload: IObject): Promise<IApiResponse<IAuthInfo>> =>
		await axiosIns.post('/api/auth/refresh', payload),

	logout: async (): Promise<IApiResponse> => await axiosIns.get('/api/auth/logout'),

	signup: async (payload: IObject): Promise<IApiResponse> => await axiosIns.post('/auth/signup', payload),

	getUserProfile: async (): Promise<IApiResponse<IUser>> => await axiosIns.get('/api/auth/user'),
};
