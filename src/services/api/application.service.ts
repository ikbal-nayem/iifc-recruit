
import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse, IObject } from '@/interfaces/common.interface';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';


export const ApplicationService = {
	getList: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/get-list', payload),

	createAll: async (payload: IObject[]): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/create-all', payload),

	updateAll: async (payload: IObject[]): Promise<IApiResponse<Application[]>> =>
		await axiosIns.put('/application/update-all', payload),
};
