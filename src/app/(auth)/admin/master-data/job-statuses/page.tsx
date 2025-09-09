
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { jobs } from '@/lib/data';

export default function MasterJobStatusesPage() {
  const statuses = Array.from(new Set(jobs.map(j => j.status))).map(name => ({ name, isActive: true }));

  return (
    <MasterDataCrud 
        title="Job Statuses"
        description="Manage the statuses used for job postings (e.g., Open, Closed)."
        initialData={statuses}
        noun="Job Status"
    />
    );
}
