
'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { candidates } from '@/lib/data';

export default function MasterLanguagesPage() {
  const languages = Array.from(new Set(candidates.flatMap(c => c.languages.map(l => l.name)))).map((name, index) => ({ id: index + 1, name, isActive: true }));

  return (
    <MasterDataCrud
        title="Languages"
        description="Manage the languages used in candidate profiles."
        noun="Language"
        items={languages}
        meta={{ page: 1, limit: languages.length }}
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
