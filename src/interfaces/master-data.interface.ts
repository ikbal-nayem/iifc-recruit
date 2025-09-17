export interface ICommonMasterData {
	id?: string;
	name: string;
	isActive: boolean;
}

export interface IEducationInstitution extends ICommonMasterData {
	country: string;
}
