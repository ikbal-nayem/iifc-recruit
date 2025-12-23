import { ROUTES } from '@/constants/routes.constant';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { redirect } from 'next/navigation';

export type StatusCountProps = {
	count: number;
	status: string;
	statusDTO: EnumDTO;
};

export default function ApplicationsPage() {
	// This page is a placeholder. The main functionality is under the status routes.
	// Redirect to the main pending posts page.
	redirect(ROUTES.APPLICATION_PROCESSING);
}
