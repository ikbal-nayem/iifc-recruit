import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { JobRequest, JobRequestStatus } from '@/interfaces/job.interface';

export const JobRequestService = {
	create: async (payload: Omit<JobRequest, 'id'>): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.post('/job-request/create', payload),

	update: async (payload: JobRequest): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.put('/job-request/update', payload),

	getList: async (payload: IApiRequest): Promise<IApiResponse<JobRequest[]>> =>
		await axiosIns.post('/job-request/get-list', payload),

	getById: async (id: string): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.get(`/job-request/get-by-id/${id}`),

	delete: async (id: string): Promise<void> => await axiosIns.delete(`/job-request/delete/${id}`),

	updateStatus: async (id: string, status: JobRequestStatus): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.put(`/job-request/update-status/${id}?status=${status}`),
};
