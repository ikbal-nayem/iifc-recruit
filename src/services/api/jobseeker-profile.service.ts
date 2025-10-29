
import { getAuthenticatedAxios } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import {
	AcademicInfo,
	Award,
	Certification,
	ChildInfo,
	FamilyInfo,
	IProfileCompletionStatus,
	Jobseeker,
	JobseekerSearch,
	Language,
	PersonalInfo,
	ProfessionalInfo,
	Publication,
	Resume,
	Training,
} from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

const createProfileCrud = <T extends { id?: string | number }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/jobseeker/${entity}/get-by-user`);
	},

	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> => {
		const axios = getAuthenticatedAxios();
		return axios.post(`/jobseeker/${entity}/create`, payload);
	},

	update: async (payload: T): Promise<IApiResponse<T>> => {
		const axios = getAuthenticatedAxios();
		return axios.put(`/jobseeker/${entity}/update`, payload);
	},

	delete: async (id: string | number): Promise<IApiResponse<void>> => {
		const axios = getAuthenticatedAxios();
		return axios.delete(`/jobseeker/${entity}/delete/${id}`);
	},
});

const createProfileCrudWithFormData = <T extends { id?: string | number }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[] | T>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/jobseeker/${entity}/get-by-user`);
	},

	save: async (formData: FormData | T): Promise<IApiResponse<T>> => {
		const axios = getAuthenticatedAxios();
		return axios.post(`/jobseeker/${entity}/save`, formData);
	},

	delete: async (id: string | number): Promise<IApiResponse<void>> => {
		const axios = getAuthenticatedAxios();
		return axios.delete(`/jobseeker/${entity}/delete/${id}`);
	},
});

export const JobseekerProfileService = {
	getProfile: async (id?: string): Promise<IApiResponse<Jobseeker>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(id ? `/jobseeker/profile/get-by-user?id=${id}` : '/jobseeker/profile/get-by-user');
	},

	getProfileCompletion: async (): Promise<IApiResponse<IProfileCompletionStatus>> => {
		const axios = getAuthenticatedAxios();
		return axios.get('/jobseeker/profile/get-profile-completion');
	},

	search: async (payload: IApiRequest): Promise<IApiResponse<JobseekerSearch[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/jobseeker/profile/search', payload);
	},

	personalInfo: {
		...createProfileCrudWithFormData<PersonalInfo>('personal-info'),
	},
	spouse: {
		get: async (): Promise<IApiResponse<FamilyInfo>> => {
			const axios = getAuthenticatedAxios();
			return axios.get('/jobseeker/spouse/get-by-user');
		},
		save: async (payload: FamilyInfo): Promise<IApiResponse<FamilyInfo>> => {
			const axios = getAuthenticatedAxios();
			return axios.post('/jobseeker/spouse/save', payload);
		},
	},
	children: {
		...createProfileCrud<ChildInfo>('children'),
		get: async (): Promise<IApiResponse<ChildInfo[]>> => {
			const axios = getAuthenticatedAxios();
			return axios.get('/jobseeker/children/get-by-user');
		},
		update: async (payload: ChildInfo): Promise<IApiResponse<ChildInfo>> => {
			const axios = getAuthenticatedAxios();
			return axios.put('/jobseeker/children/update', payload);
		},
	},
	publication: createProfileCrud<Publication>('publication'),
	language: createProfileCrud<Language>('language'),
	award: createProfileCrud<Award>('award'),
	academic: createProfileCrudWithFormData<AcademicInfo>('education'),
	experience: createProfileCrudWithFormData<ProfessionalInfo>('experience'),
	training: createProfileCrudWithFormData<Training>('training'),
	certification: createProfileCrudWithFormData<Certification>('certification'),

	getSkills: async (): Promise<IApiResponse<ICommonMasterData[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/jobseeker/skill/get-by-user`);
	},

	saveSkills: async (payload: { skillIds: (string | undefined)[] }): Promise<IApiResponse<any>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/jobseeker/skill/save', payload);
	},

	resume: {
		get: async (): Promise<IApiResponse<Resume[]>> => {
			const axios = getAuthenticatedAxios();
			return axios.get(`/jobseeker/resume/get-by-user`);
		},
		add: async (formData: FormData): Promise<IApiResponse<Resume>> => {
			const axios = getAuthenticatedAxios();
			return axios.post(`/jobseeker/resume/create`, formData);
		},
		delete: async (id: string | number): Promise<IApiResponse<void>> => {
			const axios = getAuthenticatedAxios();
			return axios.delete(`/jobseeker/resume/delete/${id}`);
		},
		setActive: async (resumeId: string | number): Promise<IApiResponse<any>> => {
			const axios = getAuthenticatedAxios();
			return axios.post(`/jobseeker/resume/toggle-active-status?resumeId=${resumeId}`);
		},
	},
};
