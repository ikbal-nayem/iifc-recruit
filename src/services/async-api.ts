import { IClientOrganization, ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from './api/master-data.service';
import { IObject } from '@/interfaces/common.interface';

const initPayload: IObject = {
	body: { searchKey: '' },
	meta: { limit: 30, page: 0 },
};

export const getExaminerAsync = (searchKey: string, callback: (data: IClientOrganization[]) => void) => {
	initPayload.body.searchKey = searchKey;
	initPayload.body.isExaminer = true;
	MasterDataService.clientOrganization.getList(initPayload).then((resp) => callback(resp?.body || []));
};

export const getSkillsAsync = (searchKey: string, callback: (data: ICommonMasterData[]) => void) => {
	initPayload.body.searchKey = searchKey;
	MasterDataService.skill.getList(initPayload).then((resp) => callback(resp?.body || []));
};
