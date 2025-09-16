import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

export const MasterDataService = {
	skill: {
		getList: async (payload: IApiRequest): Promise<IApiResponse<ICommonMasterData[]>> =>
			await axiosIns.post(`/master-data/skill/get-list`, payload),
		add: async (payload: ICommonMasterData): Promise<IApiResponse<ICommonMasterData>> =>
			await axiosIns.post(`/master-data/skill/create`, payload),
		update: async (payload: ICommonMasterData): Promise<IApiResponse<ICommonMasterData>> =>
			await axiosIns.put(`/master-data/skill/update`, payload),
		delete: async (id: string): Promise<void> => await axiosIns.delete(`/master-data/skill/delete/${id}`),
	}
};
