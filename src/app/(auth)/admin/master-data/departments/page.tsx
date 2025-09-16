
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { jobs } from '@/lib/data';

export default function MasterDepartmentsPage() {
  const departments = Array.from(new Set(jobs.map(j => j.department))).map((name, index) => ({ id: index + 1, name, isActive: true }));

  return (
    <MasterDataCrud
        title="Departments"
        description="Manage the departments used for job postings."
        noun="Department"
        items={departments}
        meta={{ page: 1, limit: departments.length }}
        isLoading={false}
        onAdd={async (name) => { console.log('add', name); return null; }}
        onUpdate={async (id, name) => { console.log('update', id, name); return null; }}
        onDelete={async (id) => { console.log('delete', id); return false; }}
        onToggle={async (id) => { console.log('toggle', id); return null; }}
        onPageChange={() => {}}
        onSearch={() => {}}
    />
    );
}
