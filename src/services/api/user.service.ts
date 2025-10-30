import { axiosIns } from '@/config/api.config';
import { IApiResponse, IObject } from '@/interfaces/common.interface';

export const UserService = {
	saveProfileImage: async (formData: FormData): Promise<IApiResponse<any>> => {
		return axiosIns.post('/user/profile-image/save', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
	},

	createJobseeker: async (payload: IObject): Promise<IApiResponse<any>> => {
		return axiosIns.post('/user/jobseeker/create', payload);
	},
	bulkCreateJobseeker: async (payload: IObject): Promise<IApiResponse<any[]>> => {
		return axiosIns.post('/user/jobseeker/bulk-create', payload);
	},
};
