import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { IInterestedIn } from '@/interfaces/jobseeker.interface';

export const JobseekerInterestService = {
	get: async (): Promise<IApiResponse<IInterestedIn[]>> => {
		return axiosIns.get('/jobseeker/interested-in/get-by-user');
	},
	add: async (payload: { postId: string }): Promise<IApiResponse<IInterestedIn>> => {
		return axiosIns.post('/jobseeker/interested-in/create', payload);
	},
	delete: async (id: string): Promise<IApiResponse<void>> => {
		return axiosIns.delete(`/jobseeker/interested-in/delete/${id}`);
	},
};
