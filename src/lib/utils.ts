import { ENV } from '@/constants/env.constant';
import { IFile, IObject } from '@/interfaces/common.interface';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isNull = (val: string | null | undefined | Array<any> | IObject) => {
	return (
		val === null ||
		val === undefined ||
		val === '' ||
		val === 'null' ||
		val === 'undefined' ||
		(val instanceof Object && Object.keys(val || {}).length === 0) ||
		(Array.isArray(val) && val?.length === 0)
	);
};

export const makeReqDateFormat = (date: Date | string | number) => {
	return format(new Date(date), 'yyyy-MM-dd');
};

export const makePreviewURL = (file: File | IFile | string | null | undefined) => {
	if (!file) return '';
	if (typeof file === 'string') return `${ENV.API_GATEWAY}/files/get?path=${file}`;
	if ('filePath' in file) return `${ENV.API_GATEWAY}/files/get?path=${file.filePath}`;
	return URL.createObjectURL(file);
};

export const makeDownloadURL = (file: IFile | string | null | undefined) => {
	if (!file) return '';
	if (typeof file === 'string') return `${makePreviewURL(file)}&disposition=attachment`;
	if ('filePath' in file) return `${makePreviewURL(file.filePath)}&disposition=attachment`;
	return URL.createObjectURL(file);
}
