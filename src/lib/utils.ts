import { IObject } from '@/interfaces/common.interface';
import { clsx, type ClassValue } from 'clsx';
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
