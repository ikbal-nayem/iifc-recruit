
import { getAuthenticatedAxios, axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import {
	EnumDTO,
	IClientOrganization,
	ICommonMasterData,
	IEducationInstitution,
	IOrganization,
	IOutsourcingCategory,
	IOutsourcingCharge,
	IOutsourcingZone,
	IPost,
} from '@/interfaces/master-data.interface';

const createMasterDataCrud = <T>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/master-data/${entity}/get?deleted=false`);
	},
	getList: async (payload: IApiRequest): Promise<IApiResponse<T[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.post(`/master-data/${entity}/get-list`, payload);
	},
	getDetails: async (id: string): Promise<IApiResponse<T>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/master-data/${entity}/get-by-id/${id}`);
	},
	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> => {
		const axios = getAuthenticatedAxios();
		return axios.post(`/master-data/${entity}/create`, payload);
	},
	update: async (payload: T): Promise<IApiResponse<T>> => {
		const axios = getAuthenticatedAxios();
		return axios.put(`/master-data/${entity}/update`, payload);
	},
	delete: async (id: string): Promise<void> => {
		const axios = getAuthenticatedAxios();
		return axios.delete(`/master-data/${entity}/delete/${id}`);
	},
});

export const MasterDataService = {
	getEnum: async (
		enumType:
			| 'gender'
			| 'marital-status'
			| 'religion'
			| 'proficiency-level'
			| 'spouse-status'
			| 'job-request-type'
			| 'application-status'
	): Promise<IApiResponse<EnumDTO[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/master-data/enum/${enumType}`);
	},

	skill: createMasterDataCrud<ICommonMasterData>('skill'),
	department: createMasterDataCrud<ICommonMasterData>('department'),
	language: createMasterDataCrud<ICommonMasterData>('language'),
	degreeLevel: createMasterDataCrud<ICommonMasterData>('education-degree-level'),
	educationDomain: createMasterDataCrud<ICommonMasterData>('education-domain'),
	industryType: createMasterDataCrud<ICommonMasterData>('industry-type'),
	organizationType: createMasterDataCrud<ICommonMasterData>('organization-type'),
	positionLevel: createMasterDataCrud<ICommonMasterData>('position-level'),
	certification: createMasterDataCrud<ICommonMasterData>('certification-type'),
	trainingType: createMasterDataCrud<ICommonMasterData>('training-type'),
	country: {
		get: async (): Promise<IApiResponse<ICommonMasterData[]>> => {
			const axios = getAuthenticatedAxios();
			return axios.get(`/master-data/country/get?deleted=false`);
		},
		getList: async (payload: IApiRequest): Promise<IApiResponse<ICommonMasterData[]>> => {
			const axios = getAuthenticatedAxios();
			return axios.post(`/master-data/country/get-list`, payload);
		},
		getDetails: async (id: string): Promise<IApiResponse<ICommonMasterData>> => {
			const axios = getAuthenticatedAxios();
			return axios.get(`/master-data/country/get-by-id/${id}`);
		},
		getDivisions: async (): Promise<IApiResponse<ICommonMasterData[]>> => {
			return axiosIns.get('/master-data/country/divisions');
		},
		getDistricts: async (divisionId?: string): Promise<IApiResponse<ICommonMasterData[]>> => {
			const url = divisionId
				? `/master-data/country/districts?divisionId=${divisionId}`
				: '/master-data/country/districts';
			return await axiosIns.get(url);
		},
		getUpazilas: async (districtId: string): Promise<IApiResponse<ICommonMasterData[]>> => {
			return axiosIns.get(`/master-data/country/upazilas?districtId=${districtId}`);
		},
	},
	educationInstitution: createMasterDataCrud<IEducationInstitution>('education-institution'),
	organization: createMasterDataCrud<IOrganization>('organization'),
	clientOrganization: createMasterDataCrud<IClientOrganization>('client-organization'),
	outsourcingCategory: createMasterDataCrud<IOutsourcingCategory>('outsourcing-category'),
	outsourcingZone: createMasterDataCrud<IOutsourcingZone>('outsourcing-zone'),
	post: createMasterDataCrud<IPost>('post'),
	outsourcingCharge: createMasterDataCrud<IOutsourcingCharge>('outsourcing-charge'),
};
