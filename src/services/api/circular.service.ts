
import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { ICircular } from '@/interfaces/job.interface';

export const CircularService = {
	search: async (payload: IApiRequest): Promise<IApiResponse<ICircular[]>> => {
		return axiosIns.post('/circular/public/search', payload);
	},
	getDetails: async (id: string): Promise<IApiResponse<ICircular>> => {
		return axiosIns.get(`/circular/public/get-by-id/${id}`);
	},
};

