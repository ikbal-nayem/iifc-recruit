export interface IObject {
	[key: string]: any;
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
}

export interface IApiRequest {
	body?: IObject;
	meta: IMeta;
}
