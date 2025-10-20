import { RequestManagementPage } from '@/components/app/admin/job-management/request-management-page';

export default function ManageJobRequestPage({ params }: { params: { id: string } }) {
	return <RequestManagementPage requestId={params.id} />;
}
