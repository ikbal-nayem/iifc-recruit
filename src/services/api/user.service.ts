import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';

export const UserService = {
	saveProfileImage: async (formData: FormData): Promise<IApiResponse<any>> => {
		return axiosIns.post('/user/profile-image/save', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
	},
};
