import { axiosIns } from '@/config/api.config';
import { IAuthInfo } from '@/interfaces/auth.interface';
import { IApiResponse, IObject } from '@/interfaces/common.interface';

export const AuthService = {
	login: async (payload: IObject): Promise<IApiResponse<IAuthInfo>> =>
		await axiosIns.post('/api/auth/login', payload),

	refreshToken: async (payload: IObject): Promise<IApiResponse<IAuthInfo>> =>
		await axiosIns.post('/api/auth/refresh', payload),

	logout: async (): Promise<IApiResponse<void>> => {
		return axiosIns.get('/api/auth/logout');
	},

	signup: async (payload: IObject): Promise<IApiResponse<void>> =>
		await axiosIns.post('/user/jobseeker/public/signup', payload),
	
	changePassword: async (payload: IObject): Promise<IApiResponse<void>> => {
		return axiosIns.post('/user/update-password', payload);
	},
	
	forgotPassword: async (email: string): Promise<IApiResponse<void>> => {
		return axiosIns.post(`/api/auth/forgot-password?email=${email}`);
	},

	resetPassword: async (payload: IObject): Promise<IApiResponse<void>> => {
		return axiosIns.post('/api/auth/reset-password', payload);
	},
};
