
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { jobs } from '@/lib/data';

export default function MasterJobStatusesPage() {
  const statuses = Array.from(new Set(jobs.map(j => j.status))).map((name, index) => ({ id: index + 1, name, isActive: true }));

  return (
    <MasterDataCrud
        title="Job Statuses"
        description="Manage the statuses used for job postings (e.g., Open, Closed)."
        noun="Job Status"
        items={statuses}
        meta={{ page: 1, limit: statuses.length }}
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
