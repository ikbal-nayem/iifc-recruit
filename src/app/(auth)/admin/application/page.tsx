import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes.constant';

export default function ApplicationsPage() {
	// This page is a placeholder. The main functionality is under the status routes.
	// Redirect to the main pending posts page.
	redirect(ROUTES.APPLICATION_PENDING);
}
