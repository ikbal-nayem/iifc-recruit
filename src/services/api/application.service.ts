
import { axiosIns } from '@/config/api.config';
import { Application } from '@/interfaces/application.interface';
import { IApiRequest, IApiResponse, IObject } from '@/interfaces/common.interface';

export const ApplicationService = {
	getList: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/get-list', payload),

	getByApplicant: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/get-by-applicant', payload),

	getProcessingList: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/get-processing-list', payload),

	getShortlistedList: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/get-shortlisted-list', payload),

	search: async (payload: IApiRequest): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/search', payload),

	createAll: async (payload: IObject[]): Promise<IApiResponse<Application[]>> =>
		await axiosIns.post('/application/create-all', payload),

	updateAll: async (payload: IObject[]): Promise<IApiResponse<Application[]>> =>
		await axiosIns.put('/application/update-all', payload),

	apply: async (payload: { requestedPostId: string }): Promise<IApiResponse<any>> =>
		await axiosIns.post('/application/apply', payload),
	
	getStatistics: async (applicantId: string): Promise<IApiResponse<any>> =>
		await axiosIns.get(`/application/statistics/${applicantId}`),

	applicantMarkAsHired: async (payload: IObject): Promise<IApiResponse<any>> =>
		await axiosIns.post('/application/mark-as-hired', payload),
};
