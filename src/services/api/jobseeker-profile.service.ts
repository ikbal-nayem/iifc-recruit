import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import {
	AcademicInfo,
	Award,
	Certification,
	ChildInfo,
	FamilyInfo,
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
	get: async (): Promise<IApiResponse<T[]>> => await axiosIns.get(`/jobseeker/${entity}/get-by-user`),

	save: async (formData: FormData): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/jobseeker/${entity}/save`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		}),

	delete: async (id: number | string): Promise<IApiResponse<void>> =>
		await axiosIns.delete(`/jobseeker/${entity}/delete/${id}`),
});

export const JobseekerProfileService = {
	personalInfo: {
		get: async (): Promise<IApiResponse<PersonalInfo>> =>
			await axiosIns.get('/jobseeker/profile/personal-info'),
		update: async (payload: PersonalInfo): Promise<IApiResponse<PersonalInfo>> =>
			await axiosIns.post('/jobseeker/profile/personal-info/save', payload),
		saveProfileImage: async (formData: FormData): Promise<IApiResponse<any>> =>
			await axiosIns.post('/jobseeker/profile/profile-image/save', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			}),
	},
	spouse: {
		get: async (): Promise<IApiResponse<FamilyInfo>> => await axiosIns.get('/jobseeker/spouse/get-by-user'),
		update: async (payload: FamilyInfo): Promise<IApiResponse<FamilyInfo>> =>
			await axiosIns.put('/jobseeker/spouse/update', payload),
	},
	children: createProfileCrud<ChildInfo>('children'),
	publication: createProfileCrud<Publication>('publication'),
	language: createProfileCrud<Language>('language'),
	award: createProfileCrud<Award>('award'),
	academic: createProfileCrudWithFormData<AcademicInfo>('education'),
	experience: createProfileCrudWithFormData<ProfessionalInfo>('experience'),
	training: createProfileCrudWithFormData<Training>('training'),
	certification: createProfileCrudWithFormData<Certification>('certification'),

	getSkills: async (): Promise<IApiResponse<ICommonMasterData[]>> =>
		await axiosIns.get(`/jobseeker/skill/get-skills`),

	saveSkills: async (payload: { skillIds: (number | string | undefined)[] }): Promise<IApiResponse<any>> =>
		await axiosIns.post('/jobseeker/skill/save-skills', payload),

	resume: {
		get: async (): Promise<IApiResponse<Resume[]>> => await axiosIns.get('/jobseeker/resume/get'),
		add: async (formData: FormData): Promise<IApiResponse<Resume>> =>
			await axiosIns.post('/jobseeker/resume/upload', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			}),
		setActive: async (resumeId: number): Promise<IApiResponse<any>> =>
			await axiosIns.post(`/jobseeker/resume/toggle-active-status?resumeId=${resumeId}`),
		delete: async (id: number): Promise<IApiResponse<void>> =>
			await axiosIns.delete(`/jobseeker/resume/delete/${id}`),
	},
};
