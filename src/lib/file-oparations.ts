import { ENV } from '@/constants/env.constant';
import { IFile } from '@/interfaces/common.interface';

export const isFileImage = (fileType: string) => fileType.startsWith('image/') && !fileType.includes('svg');

export const isFilePdf = (fileType: string) => fileType === 'application/pdf';

export const makePreviewURL = (file: File | IFile | string | null | undefined) => {
	if (!file) return '';
	if (typeof file === 'string') {
		if (file.startsWith('http')) return file;
		return `${ENV.API_GATEWAY}/files/public/get?path=${file}`;
	}
	if ('filePath' in file) {
		if (file.filePath.startsWith('http')) return file.filePath;
		return `${ENV.API_GATEWAY}/files/public/get?path=${file.filePath}`;
	}
	return URL.createObjectURL(file);
};

export const makeDownloadURL = (file: IFile | string | null | undefined) => {
	if (!file) return '';
	if (typeof file === 'string') return `${makePreviewURL(file)}&disposition=attachment`;
	if ('filePath' in file) return `${makePreviewURL(file.filePath)}&disposition=attachment`;
	return URL.createObjectURL(file);
};
