import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

const createMasterDataCrud = (entity: string) => ({
	getList: async (payload: IApiRequest): Promise<IApiResponse<ICommonMasterData[]>> =>
		await axiosIns.post(`/master-data/${entity}/get-list`, payload),
	add: async (payload: ICommonMasterData): Promise<IApiResponse<ICommonMasterData>> =>
		await axiosIns.post(`/master-data/${entity}/create`, payload),
	update: async (payload: ICommonMasterData): Promise<IApiResponse<ICommonMasterData>> =>
		await axiosIns.put(`/master-data/${entity}/update`, payload),
	delete: async (id: string): Promise<void> => await axiosIns.delete(`/master-data/${entity}/delete/${id}`),
});

export const MasterDataService = {
	skill: createMasterDataCrud('skill'),
	department: createMasterDataCrud('department'),
	language: createMasterDataCrud('language'),
	jobStatus: createMasterDataCrud('job-status'),
	applicationStatus: createMasterDataCrud('application-status'),
	degreeLevel: createMasterDataCrud('degree-level'),
	educationDomain: createMasterDataCrud('education-domain'),
	industryType: createMasterDataCrud('industry-type'),
	organizationType: createMasterDataCrud('organization-type'),
	positionLevel: createMasterDataCrud('position-level'),
	certification: createMasterDataCrud('certification'),
	trainingType: createMasterDataCrud('training-type'),
};
