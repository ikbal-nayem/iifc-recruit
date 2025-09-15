import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { ISkill } from '@/interfaces/master-data.interface';

export const MasterDataService = {
	getSkills: async (payload: IApiRequest): Promise<IApiResponse<ISkill[]>> =>
		await axiosIns.post(`/admin/master-data/skill/get-list`, payload),
	addSkill: async (skill: { name: string }): Promise<ISkill> =>
		await axiosIns.post(`/admin/master-data/skill`, skill),
	updateSkill: async (id: number, skill: { name: string }): Promise<ISkill> =>
		await axiosIns.put(`/admin/master-data/skill/${id}`, skill),
	toggleSkillStatus: async (id: number): Promise<ISkill> =>
		await axiosIns.patch(`/admin/master-data/skill/${id}/toggle-status`),
	deleteSkill: async (id: number): Promise<void> =>
		await axiosIns.delete(`/admin/master-data/skill/${id}`),
};
