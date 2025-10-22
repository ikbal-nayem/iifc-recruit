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
	return /^[a-zA-Z0-9 .,_()-\s]*$/.test(value);
};

export const isBangla = (value: string) => {
	return /^[\u0980-\u09FF0-9 .,_()-\s]*$/.test(value);
};

type BadgeVariant =
	| 'default'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
	| 'outline'
	| 'outline-danger'
	| 'outline-success'
	| 'outline-warning'
	| 'outline-info'
	| 'lite-success'
	| 'lite-warning'
	| 'lite-danger'
	| 'lite-info';

export const getStatusVariant = (status?: string): BadgeVariant => {
	if (!status) return 'secondary';
	const lowerCaseStatus = status.toLowerCase();

	switch (lowerCaseStatus) {
		// Success states
		case 'published':
		case 'hired':
		case 'completed':
			return 'success';

		case 'active':
		case 'approved':
		case 'accepted':
			return 'lite-success';

		// Secondary states
		case 'draft':
		case 'archived':
		case 'inactive':
			return 'secondary';
		
		// Success states - Outline variant
		case 'verified':
		case 'confirmed':
			return 'outline-success';

		// Warning states - Outline variant
		case 'on-hold':
		case 'awaiting':
			return 'outline-warning';

		// Info states - Outline variant
		case 'applied':
		case 'reviewing':
		case 'in-review':
			return 'outline-info';

		// Warning/Pending states - Lite variant
		case 'pending':
		case 'shortlisted':
		case 'interview':
		case 'exam':
			return 'lite-warning';

		// Info/Progress states - Lite variant
		case 'in-progress':
		case 'processing':
			return 'lite-info';

		// Danger/Negative states
		case 'rejected':
		case 'cancelled':
		case 'failed':
		case 'expired':
			return 'outline-danger';

		case 'declined':
		case 'disqualified':
		case 'terminated':
			return 'danger';

		// Default fallback
		default:
			return 'outline';
	}
};
