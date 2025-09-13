
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterIndustryTypesPage() {
  const initialData = [
      { name: "Information Technology", isActive: true },
      { name: "Finance & Banking", isActive: true },
      { name: 'Telecommunication', isActive: true },
      { name: 'Infrastructure', isActive: true },
  ];

  return (
    <MasterDataCrud 
        title="Industry Types"
        description="Manage the types of industries for organizations."
        initialData={initialData}
        noun="Industry Type"
    />
    );
}
