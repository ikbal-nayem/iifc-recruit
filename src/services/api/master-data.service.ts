import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import {
	EnumDTO,
	ICommonMasterData,
	IEducationInstitution,
	IOrganization,
    IClientOrganization,
	IOutsourcingCategory,
	IOutsourcingCharge,
	IOutsourcingService,
	IOutsourcingZone,
} from '@/interfaces/master-data.interface';

const createMasterDataCrud = <T>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> =>
		await axiosIns.get(`/master-data/${entity}/get?isDeleted=false`),
	getList: async (payload: IApiRequest): Promise<IApiResponse<T[]>> =>
		await axiosIns.post(`/master-data/${entity}/get-list`, payload),
	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/master-data/${entity}/create`, payload),
	update: async (payload: T): Promise<IApiResponse<T>> =>
		await axiosIns.put(`/master-data/${entity}/update`, payload),
	delete: async (id: string): Promise<void> => await axiosIns.delete(`/master-data/${entity}/delete/${id}`),
});

export const MasterDataService = {
	getEnum: async (
		enumType: 'gender' | 'marital-status' | 'religion' | 'proficiency-level' | 'spouse-status'
	): Promise<IApiResponse<EnumDTO[]>> => await axiosIns.get(`/master-data/enum/${enumType}`),

	skill: createMasterDataCrud('skill'),
	department: createMasterDataCrud('department'),
	language: createMasterDataCrud('language'),
	degreeLevel: createMasterDataCrud('education-degree-level'),
	educationDomain: createMasterDataCrud('education-domain'),
	industryType: createMasterDataCrud('industry-type'),
	organizationType: createMasterDataCrud('organization-type'),
	positionLevel: createMasterDataCrud('position-level'),
	certification: createMasterDataCrud('certification-type'),
	trainingType: createMasterDataCrud('training-type'),
	country: {
		...createMasterDataCrud('country'),
		getDivisions: async (): Promise<IApiResponse<ICommonMasterData[]>> =>
			await axiosIns.get('/master-data/country/divisions'),
		getDistricts: async (divisionId?: string): Promise<IApiResponse<ICommonMasterData[]>> => {
			const url = divisionId
				? `/master-data/country/districts?divisionId=${divisionId}`
				: '/master-data/country/districts';
			return await axiosIns.get(url);
		},
		getUpazilas: async (districtId: string): Promise<IApiResponse<ICommonMasterData[]>> =>
			await axiosIns.get(`/master-data/country/upazilas?districtId=${districtId}`),
	},
	educationInstitution: createMasterDataCrud<IEducationInstitution>('education-institution'),
	organization: createMasterDataCrud<IOrganization>('organization'),
    clientOrganization: createMasterDataCrud<IClientOrganization>('client-organization'),
	outsourcingCategory: createMasterDataCrud<IOutsourcingCategory>('outsourcing-category'),
	outsourcingZone: createMasterDataCrud<IOutsourcingZone>('outsourcing-zone'),
	outsourcingService: createMasterDataCrud<IOutsourcingService>('outsourcing-service'),
	outsourcingCharge: createMasterDataCrud<IOutsourcingCharge>('outsourcing-charge'),
};
