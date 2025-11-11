
import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';

type OrgStats = {
	clientCount: number;
	examinerCount: number;
	totalCount: number;
};

type StatusStat = {
    statusKey: string;
    count: number;
    statusDTO: {
        nameEn: string;
        nameBn: string;
        value: string;
    };
};

export const StatisticsService = {
	getClientOrganizationStats: async (): Promise<IApiResponse<OrgStats>> => {
		return axiosIns.get('/statistics/client-organization');
	},
	getJobseekerStats: async (): Promise<IApiResponse<number>> => {
		return axiosIns.get('/statistics/job-seeker');
	},
    getJobRequestStats: async (): Promise<IApiResponse<StatusStat[]>> => {
        return axiosIns.get('/statistics/job-request');
    },
    getJobRequestPostStats: async (): Promise<IApiResponse<StatusStat[]>> => {
        return axiosIns.get('/statistics/job-request-post');
    }
};
