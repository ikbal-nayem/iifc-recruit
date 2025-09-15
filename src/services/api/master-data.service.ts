import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';

export const MasterDataService = {
	getSkills: async (payload: IApiRequest): Promise<IApiResponse> =>
		await axiosIns.post(`/admin/master-data/skill/get-list`, payload),
};
