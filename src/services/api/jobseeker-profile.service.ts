
'use client';

import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { Award, Certification, Language, Publication, Resume, Training } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { ProfessionalInfo } from '@/lib/types';
import { makeFormData } from '@/lib/utils';

const createProfileCrud = <T extends { id?: number | string }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => await axiosIns.get(`/jobseeker/${entity}/get`),

	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/jobseeker/${entity}/create`, payload),

	update: async (payload: T): Promise<IApiResponse<T>> =>
		await axiosIns.put(`/jobseeker/${entity}/update`, payload),

	delete: async (id: number | string): Promise<IApiResponse<void>> =>
		await axiosIns.delete(`/jobseeker/${entity}/delete/${id}`),
});

export const JobseekerProfileService = {
	publication: createProfileCrud<Publication>('publication'),
	language: createProfileCrud<Language>('language'),
	award: createProfileCrud<Award>('award'),
	experience: {
		get: async (): Promise<IApiResponse<ProfessionalInfo[]>> => await axiosIns.get('/jobseeker/experience/get'),
		save: async (formData: FormData): Promise<IApiResponse<ProfessionalInfo>> =>
			await axiosIns.post('/jobseeker/experience/save', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			}),
		delete: async (id: number | string): Promise<IApiResponse<void>> =>
			await axiosIns.delete(`/jobseeker/experience/delete/${id}`),
	},
	training: {
		get: async (): Promise<IApiResponse<Training[]>> => await axiosIns.get('/jobseeker/training/get'),
		save: async (formData: FormData): Promise<IApiResponse<Training>> =>
			await axiosIns.post('/jobseeker/training/save', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			}),
		delete: async (id: number): Promise<IApiResponse<void>> =>
			await axiosIns.delete(`/jobseeker/training/delete/${id}`),
	},
	certification: {
		get: async (): Promise<IApiResponse<Certification[]>> => await axiosIns.get('/jobseeker/certification/get'),
		save: async (formData: FormData): Promise<IApiResponse<Certification>> =>
			await axiosIns.post('/jobseeker/certification/save', formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			}),
		delete: async (id: number): Promise<IApiResponse<void>> =>
			await axiosIns.delete(`/jobseeker/certification/delete/${id}`),
	},
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
