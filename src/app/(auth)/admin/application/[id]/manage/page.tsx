import { ApplicationManagementPage } from '@/components/app/admin/application/application-management-page';

export default function ManageApplicationPage({ params }: { params: { id: string } }) {
	return <ApplicationManagementPage requestedPostId={params.id} />;
}
