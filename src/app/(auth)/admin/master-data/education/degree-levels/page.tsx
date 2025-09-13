
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterDegreeLevelsPage() {
  const initialData = [
      { name: "Bachelor's", isActive: true },
      { name: "Master's", isActive: true },
      { name: 'PhD', isActive: true },
  ];

  return (
    <MasterDataCrud 
        title="Degree Levels"
        description="Manage the academic degree levels (e.g., Bachelor's, Master's)."
        initialData={initialData}
        noun="Degree Level"
    />
    );
}
