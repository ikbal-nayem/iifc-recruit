import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import {
	AcademicInfo,
	Award,
	Certification,
	ChildInfo,
	FamilyInfo,
	IInterestedIn,
	IProfileCompletionStatus,
	Jobseeker,
	JobseekerSearch,
	JobseekerSkill,
	Language,
	PersonalInfo,
	ProfessionalInfo,
	Publication,
	Resume,
	Training,
} from '@/interfaces/jobseeker.interface';

const createProfileCrud = <T extends { id?: string }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => {
		return axiosIns.get(`/jobseeker/${entity}/get-by-user`);
	},

	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> => {
		return axiosIns.post(`/jobseeker/${entity}/create`, payload);
	},

	update: async (payload: T): Promise<IApiResponse<T>> => {
		return axiosIns.put(`/jobseeker/${entity}/update`, payload);
	},

	delete: async (id: string): Promise<IApiResponse<void>> => {
		return axiosIns.delete(`/jobseeker/${entity}/delete/${id}`);
	},
});

const createProfileCrudWithFormData = <T extends { id?: string }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => {
		return axiosIns.get(`/jobseeker/${entity}/get-by-user`);
	},

	save: async (formData: FormData | T): Promise<IApiResponse<T>> => {
		return axiosIns.post(`/jobseeker/${entity}/save`, formData);
	},

	delete: async (id: string): Promise<IApiResponse<void>> => {
		return axiosIns.delete(`/jobseeker/${entity}/delete/${id}`);
	},
});

export const JobseekerProfileService = {
	getProfile: async (id?: string): Promise<IApiResponse<Jobseeker>> => {
		return axiosIns.get(id ? `/jobseeker/profile/get-by-user?id=${id}` : '/jobseeker/profile/get-by-user');
	},

	getProfileCompletion: async (): Promise<IApiResponse<IProfileCompletionStatus>> => {
		return axiosIns.get('/jobseeker/profile/get-profile-completion');
	},

	search: async (payload: IApiRequest): Promise<IApiResponse<JobseekerSearch[]>> => {
		return axiosIns.post('/jobseeker/profile/search', payload);
	},

	personalInfo: {
		...createProfileCrudWithFormData<PersonalInfo>('personal-info'),
	},
	spouse: {
		get: async (): Promise<IApiResponse<FamilyInfo>> => {
			return axiosIns.get('/jobseeker/spouse/get-by-user');
		},
		save: async (payload: FamilyInfo): Promise<IApiResponse<FamilyInfo>> => {
			return axiosIns.post('/jobseeker/spouse/save', payload);
		},
	},
	children: {
		...createProfileCrud<ChildInfo>('children'),
		get: async (): Promise<IApiResponse<ChildInfo[]>> => {
			return axiosIns.get('/jobseeker/children/get-by-user');
		},
		update: async (payload: ChildInfo): Promise<IApiResponse<ChildInfo>> => {
			return axiosIns.put('/jobseeker/children/update', payload);
		},
	},
	publication: createProfileCrud<Publication>('publication'),
	language: createProfileCrud<Language>('language'),
	award: createProfileCrud<Award>('award'),
	skill: createProfileCrud<JobseekerSkill>('skill'),
	interest: createProfileCrud<IInterestedIn>('interested-in'),
	academic: createProfileCrudWithFormData<AcademicInfo>('education'),
	experience: createProfileCrudWithFormData<ProfessionalInfo>('experience'),
	training: createProfileCrudWithFormData<Training>('training'),
	certification: createProfileCrudWithFormData<Certification>('certification'),

	resume: {
		get: async (): Promise<IApiResponse<Resume[]>> => {
			return axiosIns.get(`/jobseeker/resume/get-by-user`);
		},
		add: async (formData: FormData): Promise<IApiResponse<Resume>> => {
			return axiosIns.post(`/jobseeker/resume/save`, formData);
		},
		delete: async (id: string): Promise<IApiResponse<void>> => {
			return axiosIns.delete(`/jobseeker/resume/delete/${id}`);
		},
		setActive: async (resumeId: string): Promise<IApiResponse<any>> => {
			return axiosIns.post(`/jobseeker/resume/toggle-active-status?resumeId=${resumeId}`);
		},
	},
};
