
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterTrainingTypesPage() {
  const initialData = [
      { name: "Project Management", isActive: true },
      { name: "Leadership", isActive: true },
      { name: 'Financial Modeling', isActive: true },
      { name: 'Cybersecurity', isActive: true },
  ];

  return (
    <MasterDataCrud 
        title="Training Types"
        description="Manage the types of professional trainings."
        initialData={initialData}
        noun="Training Type"
    />
    );
}
