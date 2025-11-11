import { IApiRequest } from '@/interfaces/common.interface';
import {
	IClientOrganization,
	ICommonMasterData,
	IEducationInstitution,
} from '@/interfaces/master-data.interface';
import { MasterDataService } from './api/master-data.service';

const initPayload: IApiRequest = {
	body: { searchKey: '' },
	meta: { limit: 30, page: 0 },
};

export const getExaminerAsync = (searchKey: string, callback: (data: IClientOrganization[]) => void) => {
	initPayload.body = { searchKey: searchKey, isExaminer: true };
	MasterDataService.clientOrganization.getList(initPayload).then((resp) => callback(resp?.body || []));
};

export const getOrganizationsAsync = (searchKey: string, callback: (data: IClientOrganization[]) => void) => {
	initPayload.body = { searchKey: searchKey };
	MasterDataService.clientOrganization.getList(initPayload).then((resp) => callback(resp?.body || []));
};

export const getSkillsAsync = (searchKey: string, callback: (data: ICommonMasterData[]) => void) => {
	initPayload.body = { searchKey: searchKey };
	MasterDataService.skill.getList(initPayload).then((resp) => callback(resp?.body || []));
};

export const getInstitutionsAsync = (
	searchKey: string,
	callback: (data: IEducationInstitution[]) => void
) => {
	initPayload.body = { nameEn: searchKey };
	MasterDataService.educationInstitution.getList(initPayload).then((resp) => callback(resp?.body || []));
};

export const getCertificationsAsync = (searchKey: string, callback: (data: ICommonMasterData[]) => void) => {
	initPayload.body = { nameEn: searchKey };
	MasterDataService.certification.getList(initPayload).then((resp) => callback(resp?.body || []));
};
