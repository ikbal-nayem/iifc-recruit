
import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { JobRequest, JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';

export const JobRequestService = {
	create: async (payload: Omit<JobRequest, 'id'>): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.post('/job-request/create', payload),

	update: async (payload: JobRequest): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.put('/job-request/update', payload),

	getList: async (payload: IApiRequest): Promise<IApiResponse<JobRequest[]>> =>
		await axiosIns.post('/job-request/get-list', payload),

	getRequestedPosts: async (payload: IApiRequest): Promise<IApiResponse<RequestedPost[]>> =>
		await axiosIns.post('/job-request/requested-post/get-list', payload),

	getRequestedPostById: async (id: string): Promise<IApiResponse<RequestedPost>> =>
		await axiosIns.get(`/job-request/requested-post/get-by-id/${id}`),

	getRequestedPostUpdate: async (payload: RequestedPost): Promise<IApiResponse<RequestedPost>> =>
		await axiosIns.put(`/job-request/requested-post/update`, payload),

	proceedToProcess: async (id: string): Promise<IApiResponse<any>> =>
		await axiosIns.get(`/job-request/requested-post/proceed-to-process?id=${id}`),

	getById: async (id: string): Promise<IApiResponse<JobRequest>> =>
		await axiosIns.get(`/job-request/get-by-id/${id}`),

	delete: async (id: string): Promise<void> => await axiosIns.delete(`/job-request/delete/${id}`),

	updateStatus: async (id: string, status: JobRequestStatus): Promise<IApiResponse<RequestedPost>> =>
		await axiosIns.put(`/job-request/requested-post/update-status/${id}?status=${status}`),
};
