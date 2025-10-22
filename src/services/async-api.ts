
import { IClientOrganization, ICommonMasterData } from '@/interfaces/master-data.interface';
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

export const getSkillsAsync = (searchKey: string, callback: (data: ICommonMasterData[]) => void) => {
	MasterDataService.skill
		.getList({ body: { name: searchKey }, meta: { page: 0, limit: 30 } })
		.then((resp) => callback(resp?.body || []));
}
