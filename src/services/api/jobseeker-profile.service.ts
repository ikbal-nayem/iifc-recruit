
'use client';

import { Publication } from '@/app/(auth)/jobseeker/profile-edit/publications/page';
import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { Language, Award, Training } from '@/lib/types';

const createProfileCrud = <T extends { id?: string }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => await axiosIns.get(`/jobseeker/${entity}/get`),
	
	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/jobseeker/${entity}/create`, payload),
	
	update: async (payload: T): Promise<IApiResponse<T>> =>
		await axiosIns.put(`/jobseeker/${entity}/update`, payload),

	delete: async (id: string): Promise<IApiResponse<void>> =>
		await axiosIns.delete(`/jobseeker/${entity}/delete/${id}`),
});

export const JobseekerProfileService = {
	publication: createProfileCrud<Publication>('publication'),
    language: createProfileCrud<Language>('language'),
    award: createProfileCrud<Award>('award'),
    training: createProfileCrud<Training>('training'),

	getSkills: async (userId: string): Promise<IApiResponse<ICommonMasterData[]>> =>
		await axiosIns.get(`/jobseeker/skill/get-skills-by-user-id?userId=${userId}`),

	saveSkills: async (payload: { userId: number; skillIds: (string | number)[] }): Promise<IApiResponse<any>> =>
		await axiosIns.post('/jobseeker/skill/save-skills', payload),
};
