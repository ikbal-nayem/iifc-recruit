
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterPositionLevelsPage() {
  const initialData = [
      { id: 1, name: "Entry Level", isActive: true },
      { id: 2, name: "Mid Level", isActive: true },
      { id: 3, name: 'Senior Level', isActive: true },
      { id: 4, name: 'Management', isActive: true },
      { id: 5, name: 'Executive', isActive: true },
  ];

  return (
    <MasterDataCrud
        title="Position Levels"
        description="Manage the seniority levels for job positions."
        noun="Position Level"
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
