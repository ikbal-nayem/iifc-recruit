
'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterDegreeLevelsPage() {
  const initialData = [
      { id: 1, name: "Bachelor's", isActive: true },
      { id: 2, name: "Master's", isActive: true },
      { id: 3, name: 'PhD', isActive: true },
  ];

  return (
    <MasterDataCrud
        title="Degree Levels"
        description="Manage the academic degree levels (e.g., Bachelor's, Master's)."
        noun="Degree Level"
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
