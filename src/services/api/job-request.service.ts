
import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { JobRequest, JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';

export const JobRequestService = {
	create: async (payload: Omit<JobRequest, 'id'>): Promise<IApiResponse<JobRequest>> => {
		return axiosIns.post('/job-request/create', payload);
	},
	update: async (payload: JobRequest): Promise<IApiResponse<JobRequest>> => {
		return axiosIns.put('/job-request/update', payload);
	},
	getList: async (payload: IApiRequest): Promise<IApiResponse<JobRequest[]>> => {
		return axiosIns.post('/job-request/get-list', payload);
	},
	getRequestedPosts: async (payload: IApiRequest): Promise<IApiResponse<RequestedPost[]>> => {
		return axiosIns.post('/job-request/requested-post/get-list', payload);
	},
	getRequestedPostById: async (id: string): Promise<IApiResponse<RequestedPost>> => {
		return axiosIns.get(`/job-request/requested-post/get-by-id/${id}`);
	},
	getRequestedPostUpdate: async (payload: RequestedPost): Promise<IApiResponse<RequestedPost>> => {
		return axiosIns.put(`/job-request/requested-post/update`, payload);
	},
	publishCircular: async (payload: Partial<RequestedPost>): Promise<IApiResponse<RequestedPost>> => {
		return axiosIns.post(`/job-request/requested-post/publish-circular`, payload);
	},
	proceedToProcess: async (id: string): Promise<IApiResponse<any>> => {
		return axiosIns.get(`/job-request/requested-post/proceed-to-process?id=${id}`);
	},
	proceedToShortlist: async (id: string): Promise<IApiResponse<any>> => {
		return axiosIns.get(`/job-request/requested-post/proceed-to-shortlist?id=${id}`);
	},
	getById: async (id: string): Promise<IApiResponse<JobRequest>> => {
		return axiosIns.get(`/job-request/get-by-id/${id}`);
	},
	delete: async (id: string): Promise<void> => {
		return axiosIns.delete(`/job-request/delete/${id}`);
	},
	updateStatus: async (id: string, status: JobRequestStatus): Promise<IApiResponse<RequestedPost>> => {
		return axiosIns.put(`/job-request/requested-post/update-status/${id}?status=${status}`);
	},
};
