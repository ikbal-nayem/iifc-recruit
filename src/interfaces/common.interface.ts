
export interface IObject {
	[key: string]: any;
}

export enum ResultSystem {
	GRADE = 'G',
	DIVISION = 'D',
	CLASS = 'C',
	PASS = 'P',
}

export interface IMeta {
	limit: number;
	nextPage?: number;
	page: number;
	prevPage?: number;
	resultCount?: number;
	totalPageCount?: number;
	totalRecords?: number;
}

export interface IApiResponse<T = any> {
	body: T;
	meta: IMeta;
	message?: string;
	status: number;
}

export interface IApiError {
	body?: IObject;
	message: string;
	status: number;
}

export interface IApiRequest {
	body?: IObject;
	meta?: Partial<IMeta>;
}

export interface IFile {
	id: string;
	originalFileName: string;
	fileName: string;
	fileType: string;
	filePath: string;
	fileSize: string;
}
