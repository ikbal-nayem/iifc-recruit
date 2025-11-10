import { IClientOrganization, ICommonMasterData, IEducationInstitution } from '@/interfaces/master-data.interface';
import { MasterDataService } from './api/master-data.service';
import { IApiRequest, IObject } from '@/interfaces/common.interface';

const initPayload: IApiRequest = {
	body: { searchKey: '' },
	meta: { limit: 30, page: 0 },
};

export const getExaminerAsync = (searchKey: string, callback: (data: IClientOrganization[]) => void) => {
	initPayload.body.searchKey = searchKey;
	initPayload.body.isExaminer = true;
	MasterDataService.clientOrganization.getList(initPayload).then((resp) => callback(resp?.body || []));
};

export const getOrganizationsAsync = (searchKey: string, callback: (data: IClientOrganization[]) => void) => {
	initPayload.body.searchKey = searchKey;
	delete initPayload.body.isExaminer;
	MasterDataService.clientOrganization.getList(initPayload).then((resp) => callback(resp?.body || []));
};

export const getSkillsAsync = (searchKey: string, callback: (data: ICommonMasterData[]) => void) => {
	initPayload.body.searchKey = searchKey;
	MasterDataService.skill.getList(initPayload).then((resp) => callback(resp?.body || []));
};

export const getInstitutionsAsync = (
	searchKey: string,
	callback: (data: IEducationInstitution[]) => void
) => {
	initPayload.body = { name: searchKey };
	MasterDataService.educationInstitution.getList(initPayload).then((resp) => callback(resp?.body || []));
};
