
import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';

type OrgStats = {
	clientCount: number;
	examinerCount: number;
	totalCount: number;
};

export const StatisticsService = {
	getClientOrganizationStats: async (): Promise<IApiResponse<OrgStats>> => {
		return axiosIns.get('/statistics/client-organization');
	},
	getJobseekerStats: async (): Promise<IApiResponse<number>> => {
		return axiosIns.get('/statistics/job-seeker');
	},
};
