
import { axiosIns } from '@/config/api.config';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { IApiResponse, IObject } from '@/interfaces/common.interface';

export const AuthService = {
	login: async (payload: { email: string; password: string }): Promise<IApiResponse<IAuthInfo>> =>
		await axiosIns.post('/auth/user/login', payload),

	signup: async (payload: IObject): Promise<IApiResponse> =>
		await axiosIns.post('/auth/user/signup', payload),
	
	getUserProfile: async (): Promise<IApiResponse<IUser>> =>
		await axiosIns.get('/auth/user'),
};
