
import { EducationInstitutionCrud } from '@/components/app/admin/education-institution-crud';

export default function MasterInstitutionsPage() {
  const initialData = [
      { name: 'University of Dhaka', country: 'Bangladesh', isActive: true },
      { name: 'BUET', country: 'Bangladesh', isActive: true },
      { name: 'Stanford University', country: 'United States', isActive: true },
  ];

  return (
    <EducationInstitutionCrud
        title="Education Institutions"
        description="Manage universities, colleges, and other educational institutions."
        initialData={initialData}
        noun="Institution"
    />
    );
}
