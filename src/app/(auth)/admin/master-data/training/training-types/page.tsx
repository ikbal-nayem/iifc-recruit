
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterTrainingTypesPage() {
  const initialData = [
      { id: 1, name: "Project Management", isActive: true },
      { id: 2, name: "Leadership", isActive: true },
      { id: 3, name: 'Financial Modeling', isActive: true },
      { id: 4, name: 'Cybersecurity', isActive: true },
  ];

  return (
    <MasterDataCrud
        title="Training Types"
        description="Manage the types of professional trainings."
        noun="Training Type"
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
