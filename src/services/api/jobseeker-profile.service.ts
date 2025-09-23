'use client';

import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { Publication } from '@/lib/types';

const createProfileCrud = <T extends { id?: string }>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => await axiosIns.get(`/jobseeker/profile/${entity}`),
	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> =>
		await axiosIns.post(`/jobseeker/profile/${entity}`, payload),
	update: async (payload: T): Promise<IApiResponse<T>> =>
		await axiosIns.put(`/jobseeker/profile/${entity}/${payload.id}`, payload),
	delete: async (id: string): Promise<IApiResponse<void>> =>
		await axiosIns.delete(`/jobseeker/profile/${entity}/${id}`),
});

export const JobseekerProfileService = {
	publication: createProfileCrud<Publication>('publication'),
};
