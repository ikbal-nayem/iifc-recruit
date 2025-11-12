
import { IObject } from '@/interfaces/common.interface';
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
	if (!date) return '';
	return format(new Date(date), 'yyyy-MM-dd');
};

export const makeFormData = (reqData: IObject) => {
	let data = { ...reqData };
	const fd = new FormData();
	Object.keys(data).forEach((key) => {
		if (data[key] instanceof File) {
			fd.append(key, data[key]);
			delete data[key];
		} else if (data[key] instanceof FileList) {
			for (const k of Object.keys(data[key])) fd.append(key, data[key][+k]);
			delete data[key];
		}
	});
	fd.append('body', JSON.stringify(data));
	return fd;
};

export const isEnglish = (value: string) => {
	return /^[a-zA-Z0-9 /.,_()-\s]*$/.test(value);
};

export const isBangla = (value: string) => {
	return /^[\u0980-\u09FF0-9 /.,_()-\s]*$/.test(value);
};
