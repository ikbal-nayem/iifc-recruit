'use client';

import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { Publication } from '@/lib/types';

const createProfileCrud = <T>(entity: string) => ({
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
};
