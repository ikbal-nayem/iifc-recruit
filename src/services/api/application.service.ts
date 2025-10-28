
import { getAuthenticatedAxios } from '@/config/api.config';
import { IApiRequest, IApiResponse, IObject } from '@/interfaces/common.interface';
import { Application } from '@/interfaces/application.interface';

export const ApplicationService = {
	getList: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/application/get-list', payload);
	},
	getProcessingList: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/application/get-processing-list', payload);
	},
	getShortlistedList: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/application/get-shortlisted-list', payload);
	},
	createAll: async (payload: IObject[]): Promise<IApiResponse<Application[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/application/create-all', payload);
	},
	updateAll: async (payload: IObject[]): Promise<IApiResponse<Application[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.put('/application/update-all', payload);
	},
};
