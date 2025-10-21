
import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { Application, APPLICATION_STATUS } from '@/interfaces/application.interface';

type CreateApplicationPayload = {
	applicantId: string;
	requestedPostId: number;
	status: APPLICATION_STATUS;
};

export const ApplicationService = {
	createAll: async (payload: CreateApplicationPayload[]): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/create-all', payload),
};
