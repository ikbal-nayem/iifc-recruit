
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterOrganizationTypesPage() {
  const initialData = [
      { name: "Government", isActive: true },
      { name: "Private", isActive: true },
      { name: 'Non-profit', isActive: true },
      { name: 'Multinational', isActive: true },
  ];

  return (
    <MasterDataCrud 
        title="Organization Types"
        description="Manage the types of organizations."
        initialData={initialData}
        noun="Organization Type"
    />
    );
}
