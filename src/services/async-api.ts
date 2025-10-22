import { IClientOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from './api/master-data.service';

const initPayload = {
	body: { searchKey: '' },
	meta: { limit: 30, page: 0 },
};

export const getExaminerAsync = (searchKey: string, callback: (data: IClientOrganization[]) => void) => {
	initPayload.body.searchKey = searchKey;
	MasterDataService.clientOrganization
		.getList({ body: { searchKey, isExaminer: true } })
		.then((resp) => callback(resp?.body || []));
};
