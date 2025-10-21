
import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';

type CreateApplicationPayload = {
	applicantId: string;
	requestedPostId: number;
	status: APPLICATION_STATUS;
};

export const ApplicationService = {
	getList: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/get-list', payload),

	createAll: async (payload: CreateApplicationPayload[]): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/create-all', payload),
};
