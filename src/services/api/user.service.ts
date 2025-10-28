
import { getAuthenticatedAxios } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';

export const UserService = {
	saveProfileImage: async (formData: FormData): Promise<IApiResponse<any>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/user/profile-image/save', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
	},
};
