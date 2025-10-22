
import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import {
	AcademicInfo,
	Award,
	Certification,
	ChildInfo,
	FamilyInfo,
	IProfileCompletionStatus,
	Jobseeker,
	Language,
	PersonalInfo,
	ProfessionalInfo,
	Publication,
	Resume,
	Training,
} from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

const createProfileCrud = <T extends { id?: number | string }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => await axiosIns.get(`/jobseeker/${entity}/get-by-user`),

	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/jobseeker/${entity}/create`, payload),

	update: async (payload: T): Promise<IApiResponse<T>> =>
		await axiosIns.put(`/jobseeker/${entity}/update`, payload),

	delete: async (id: number | string): Promise<IApiResponse<void>> =>
		await axiosIns.delete(`/jobseeker/${entity}/delete/${id}`),
});

const createProfileCrudWithFormData = <T extends { id?: number | string }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[] | T>> => await axiosIns.get(`/jobseeker/${entity}/get-by-user`),

	save: async (formData: FormData | T): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/jobseeker/${entity}/save`, formData),

	delete: async (id: number | string): Promise<IApiResponse<void>> =>
		await axiosIns.delete(`/jobseeker/${entity}/delete/${id}`),
});

export const JobseekerProfileService = {
	getProfile: async (): Promise<IApiResponse<Jobseeker>> =>
		await axiosIns.get('/jobseeker/profile/get-by-user'),

	getProfileCompletion: async (): Promise<IApiResponse<IProfileCompletionStatus>> =>
		await axiosIns.get('/jobseeker/profile/get-profile-completion'),

	search: async (payload: IApiRequest): Promise<IApiResponse<Jobseeker[]>> =>
		await axiosIns.post('/jobseeker/profile/search', payload),

	personalInfo: {
		...createProfileCrudWithFormData<PersonalInfo>('personal-info'),
		saveProfileImage: async (formData: FormData): Promise<IApiResponse<any>> =>
			await axiosIns.post('/jobseeker/profile-image/save', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			}),
	},
	spouse: {
		get: async (): Promise<IApiResponse<FamilyInfo>> => await axiosIns.get('/jobseeker/spouse/get-by-user'),
		save: async (payload: FamilyInfo): Promise<IApiResponse<FamilyInfo>> =>
			await axiosIns.post('/jobseeker/spouse/save', payload),
	},
	children: {
		...createProfileCrud<ChildInfo>('children'),
		get: async (): Promise<IApiResponse<ChildInfo[]>> =>
			await axiosIns.get('/jobseeker/children/get-by-user'),
		update: async (payload: ChildInfo): Promise<IApiResponse<ChildInfo>> =>
			await axiosIns.put('/jobseeker/children/update', payload),
	},
	publication: createProfileCrud<Publication>('publication'),
	language: createProfileCrud<Language>('language'),
	award: createProfileCrud<Award>('award'),
	academic: createProfileCrudWithFormData<AcademicInfo>('education'),
	experience: createProfileCrudWithFormData<ProfessionalInfo>('experience'),
	training: createProfileCrudWithFormData<Training>('training'),
	certification: createProfileCrudWithFormData<Certification>('certification'),

	getSkills: async (): Promise<IApiResponse<ICommonMasterData[]>> =>
		await axiosIns.get(`/jobseeker/skill/get-by-user`),

	saveSkills: async (payload: { skillIds: (number | string | undefined)[] }): Promise<IApiResponse<any>> =>
		await axiosIns.post('/jobseeker/skill/save', payload),

	resume: {
		...createProfileCrudWithFormData<Resume>('resume'),
		setActive: async (resumeId: number): Promise<IApiResponse<any>> =>
			await axiosIns.post(`/jobseeker/resume/toggle-active-status?resumeId=${resumeId}`),
	},
};
