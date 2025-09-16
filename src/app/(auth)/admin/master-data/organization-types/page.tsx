
'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterOrganizationTypesPage() {
  const initialData = [
      { id: 1, name: "Government", isActive: true },
      { id: 2, name: "Private", isActive: true },
      { id: 3, name: 'Non-profit', isActive: true },
      { id: 4, name: 'Multinational', isActive: true },
  ];

  return (
    <MasterDataCrud
        title="Organization Types"
        description="Manage the types of organizations."
        noun="Organization Type"
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
