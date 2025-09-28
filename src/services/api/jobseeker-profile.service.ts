'use client';

import { Publication } from '@/app/(auth)/jobseeker/profile-edit/publications/page';
import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { Award, Language } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { Resume, Training } from '@/lib/types';

const createProfileCrud = <T>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => await axiosIns.get(`/jobseeker/${entity}/get`),

	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/jobseeker/${entity}/create`, payload),

	update: async (payload: T): Promise<IApiResponse<T>> =>
		await axiosIns.put(`/jobseeker/${entity}/update`, payload),

	delete: async (id: number | string): Promise<IApiResponse<void>> =>
		await axiosIns.delete(`/jobseeker/${entity}/delete/${id}`),
});

export const JobseekerProfileService = {
	publication: createProfileCrud<Omit<Publication, 'userId'>>('publication'),
	language: createProfileCrud<Language>('language'),
	award: createProfileCrud<Award>('award'),
	training: createProfileCrud<Training>('training'),

	getSkills: async (): Promise<IApiResponse<ICommonMasterData[]>> =>
		await axiosIns.get(`/jobseeker/skill/get-skills`),

	saveSkills: async (payload: { skillIds: (number | undefined)[] }): Promise<IApiResponse<any>> =>
		await axiosIns.post('/jobseeker/skill/save-skills', payload),

	resume: {
		get: async (): Promise<IApiResponse<Resume[]>> => await axiosIns.get('/jobseeker/resume/get'),
		add: async (formData: FormData): Promise<IApiResponse<Resume>> =>
			await axiosIns.post('/jobseeker/resume/create', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			}),
		setActive: async (id: string): Promise<IApiResponse<any>> =>
			await axiosIns.put(`/jobseeker/resume/set-active/${id}`),
		delete: async (id: string): Promise<IApiResponse<void>> =>
			await axiosIns.delete(`/jobseeker/resume/delete/${id}`),
	},
};
