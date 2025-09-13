
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';

export default function MasterEducationDomainsPage() {
  const initialData = [
    { name: 'Computer Science', isActive: true },
    { name: 'Economics', isActive: true },
    { name: 'Business Administration', isActive: true },
    { name: 'Electrical Engineering', isActive: true },
    { name: 'Medicine', isActive: true },
  ];

  return (
    <MasterDataCrud 
        title="Education Domains"
        description="Manage academic domains or fields of study."
        initialData={initialData}
        noun="Domain"
    />
    );
}
