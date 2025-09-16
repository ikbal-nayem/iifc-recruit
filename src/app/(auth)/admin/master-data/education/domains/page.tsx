
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterEducationDomainsPage() {
  const initialData = [
    { id: 1, name: 'Computer Science', isActive: true },
    { id: 2, name: 'Economics', isActive: true },
    { id: 3, name: 'Business Administration', isActive: true },
    { id: 4, name: 'Electrical Engineering', isActive: true },
    { id: 5, name: 'Medicine', isActive: true },
  ];

  return (
    <MasterDataCrud
        title="Education Domains"
        description="Manage academic domains or fields of study."
        noun="Domain"
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
