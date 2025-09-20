import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { ICommonMasterData, IEducationInstitution, IOrganization, IStatus } from '@/interfaces/master-data.interface';

const createMasterDataCrud = <T extends ICommonMasterData>(entity: string) => ({
	get: async (): Promise<IApiResponse<ICommonMasterData[]>> =>
		await axiosIns.get(`/master-data/${entity}/get`),
	getList: async (payload: IApiRequest): Promise<IApiResponse<T[]>> =>
		await axiosIns.post(`/master-data/${entity}/get-list`, payload),
	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/master-data/${entity}/create`, payload),
	update: async (payload: T): Promise<IApiResponse<T>> =>
		await axiosIns.put(`/master-data/${entity}/update`, payload),
	delete: async (id: string): Promise<void> => await axiosIns.delete(`/master-data/${entity}/delete/${id}`),
});

export const MasterDataService = {
	skill: createMasterDataCrud('skill'),
	department: createMasterDataCrud('department'),
	language: createMasterDataCrud('language'),
	status: createMasterDataCrud<IStatus>('status'),
	degreeLevel: createMasterDataCrud('education-degree-level'),
	educationDomain: createMasterDataCrud('education-domain'),
	industryType: createMasterDataCrud('industry-type'),
	organizationType: createMasterDataCrud('organization-type'),
	positionLevel: createMasterDataCrud('position-level'),
	certification: createMasterDataCrud('certification-type'),
	trainingType: createMasterDataCrud('training-type'),
	country: createMasterDataCrud('country'),
	educationInstitution: createMasterDataCrud<IEducationInstitution>('education-institution'),
	organization: createMasterDataCrud<IOrganization>('organization'),
};
