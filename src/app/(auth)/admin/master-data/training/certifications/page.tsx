
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterCertificationsPage() {
  const initialData = [
      { id: 1, name: "PMP", isActive: true },
      { id: 2, name: "CFA", isActive: true },
      { id: 3, name: 'CISSP', isActive: true },
      { id: 4, name: 'FRM', isActive: true },
  ];

  return (
    <MasterDataCrud
        title="Certifications"
        description="Manage professional certifications."
        noun="Certification"
        items={initialData}
        meta={{ page: 1, limit: initialData.length }}
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
