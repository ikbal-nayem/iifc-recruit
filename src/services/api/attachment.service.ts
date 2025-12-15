import { axiosIns } from '@/config/api.config';
import { IApiRequest, IApiResponse, IAttachment } from '@/interfaces/common.interface';

export const AttachmentService = {
	getList: async (payload: IApiRequest): Promise<IApiResponse<IAttachment[]>> => {
		return axiosIns.post('/attachment/get-list', payload);
	},
	save: async (
		formData: FormData,
		body?: IAttachment,
		isUpdate = false
	): Promise<IApiResponse<IAttachment>> => {
		if (isUpdate && body) {
			formData.append('body', JSON.stringify(body));
		}
		return axiosIns.post('/attachment/save', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
	},
	delete: async (id: string): Promise<IApiResponse<void>> => {
		return axiosIns.delete(`/attachment/delete/${id}`);
	},
	getPublicAttachments: async (types: string[]): Promise<IApiResponse<IAttachment[]>> => {
		return axiosIns.post('/attachment/public/documents-by-type', types);
	},
};
