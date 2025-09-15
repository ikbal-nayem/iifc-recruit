
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterCertificationsPage() {
  const initialData = [
      { name: "PMP", isActive: true },
      { name: "CFA", isActive: true },
      { name: 'CISSP', isActive: true },
      { name: 'FRM', isActive: true },
  ];

  return (
    <MasterDataCrud 
        title="Certifications"
        description="Manage professional certifications."
        initialData={initialData}
        noun="Certification"
    />
    );
}
