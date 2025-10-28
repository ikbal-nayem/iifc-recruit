
import { axiosIns } from '@/config/api.config';
import { IAuthInfo, IUser } from '@/interfaces/auth.interface';
import { IApiResponse, IObject } from '@/interfaces/common.interface';

export const AuthService = {
	login: async (payload: IObject): Promise<IApiResponse<IAuthInfo>> =>
		await axiosIns.post('/api/auth/login', payload),

	signup: async (payload: IObject): Promise<IApiResponse> =>
		await axiosIns.post('/auth/signup', payload),
	
	getUserProfile: async (): Promise<IApiResponse<IUser>> =>
		await axiosIns.get('/auth/user'),
};
