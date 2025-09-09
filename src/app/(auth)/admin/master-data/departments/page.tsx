import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { jobs } from '@/lib/data';

export default function MasterDepartmentsPage() {
  const departments = Array.from(new Set(jobs.map(j => j.department))).map(name => ({ name, isActive: true }));

  return (
    <MasterDataCrud 
        title="Departments"
        description="Manage the departments used for job postings."
        initialData={departments}
        noun="Department"
    />
    );
}