
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterPositionLevelsPage() {
  const initialData = [
      { name: "Entry Level", isActive: true },
      { name: "Mid Level", isActive: true },
      { name: 'Senior Level', isActive: true },
      { name: 'Management', isActive: true },
      { name: 'Executive', isActive: true },
  ];

  return (
    <MasterDataCrud 
        title="Position Levels"
        description="Manage the seniority levels for job positions."
        initialData={initialData}
        noun="Position Level"
    />
    );
}
