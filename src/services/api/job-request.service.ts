
import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { JobRequest } from '@/lib/types';

export const JobRequestService = {
	create: async (payload: Omit<JobRequest, 'id'>): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.post('/job-request/create', payload),

	update: async (payload: JobRequest): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.put('/job-request/update', payload),
};
