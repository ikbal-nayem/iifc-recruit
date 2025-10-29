
import { getAuthenticatedAxios } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { JobRequest, JobRequestStatus, RequestedPost } from '@/interfaces/job.interface';

export const JobRequestService = {
	create: async (payload: Omit<JobRequest, 'id'>): Promise<IApiResponse<JobRequest>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/job-request/create', payload);
	},
	update: async (payload: JobRequest): Promise<IApiResponse<JobRequest>> => {
		const axios = getAuthenticatedAxios();
		return axios.put('/job-request/update', payload);
	},
	getList: async (payload: IApiRequest): Promise<IApiResponse<JobRequest[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/job-request/get-list', payload);
	},
	getRequestedPosts: async (payload: IApiRequest): Promise<IApiResponse<RequestedPost[]>> => {
		const axios = getAuthenticatedAxios();
		return axios.post('/job-request/requested-post/get-list', payload);
	},
	getRequestedPostById: async (id: string): Promise<IApiResponse<RequestedPost>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/job-request/requested-post/get-by-id/${id}`);
	},
	getRequestedPostUpdate: async (payload: RequestedPost): Promise<IApiResponse<RequestedPost>> => {
		const axios = getAuthenticatedAxios();
		return axios.put(`/job-request/requested-post/update`, payload);
	},
	proceedToProcess: async (id: string): Promise<IApiResponse<any>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/job-request/requested-post/proceed-to-process?id=${id}`);
	},
	proceedToShortlist: async (id: string): Promise<IApiResponse<any>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/job-request/requested-post/proceed-to-shortlist?id=${id}`);
	},
	getById: async (id: string): Promise<IApiResponse<JobRequest>> => {
		const axios = getAuthenticatedAxios();
		return axios.get(`/job-request/get-by-id/${id}`);
	},
	delete: async (id: string): Promise<void> => {
		const axios = getAuthenticatedAxios();
		return axios.delete(`/job-request/delete/${id}`);
	},
	updateStatus: async (id: string, status: JobRequestStatus): Promise<IApiResponse<RequestedPost>> => {
		const axios = getAuthenticatedAxios();
		return axios.put(`/job-request/requested-post/update-status/${id}?status=${status}`);
	},
};
