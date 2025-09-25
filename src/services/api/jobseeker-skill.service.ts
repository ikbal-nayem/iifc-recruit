
'use client';

import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

export const JobseekerSkillService = {
	getSkillsByUserId: async (userId: string): Promise<IApiResponse<ICommonMasterData[]>> =>
		await axiosIns.get(`/jobseeker/skill/get-skills-by-user-id?userId=${userId}`),

	saveSkills: async (payload: { userId: number; skillIds: (string | number)[] }): Promise<IApiResponse<any>> =>
		await axiosIns.post('/jobseeker/skill/save-skills', payload),
};
