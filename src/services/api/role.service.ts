import { axiosIns } from '@/config/api.config';
import { IApiResponse } from '@/interfaces/common.interface';
import { IRole } from '@/interfaces/master-data.interface';

export const RoleService = {
	getList: async (): Promise<IApiResponse<IRole[]>> =>
		await axiosIns.get('/role/get-list'),
};
