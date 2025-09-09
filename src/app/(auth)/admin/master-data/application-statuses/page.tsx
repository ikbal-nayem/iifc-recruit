
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { applications } from '@/lib/data';

export default function MasterApplicationStatusesPage() {
  const statuses = Array.from(new Set(applications.map(j => j.status))).map(name => ({ name, isActive: true }));

  return (
    <MasterDataCrud 
        title="Application Statuses"
        description="Manage the statuses used for job applications (e.g., Applied, Screening)."
        initialData={statuses}
        noun="Application Status"
    />
    );
}
