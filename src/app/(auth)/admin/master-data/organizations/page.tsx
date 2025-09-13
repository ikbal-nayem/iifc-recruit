
import { OrganizationCrud } from '@/components/app/admin/organization-crud';

export default function MasterOrganizationsPage() {
  const initialData = [
    {
      name: 'IIFC',
      fkCountry: 'Bangladesh',
      address: 'Ede-II, 6/B, 147, Mohakhali',
      postCode: '1212',
      fkIndustryType: 'Infrastructure',
      fkOrganizationType: 'Government',
      isActive: true,
    },
     {
      name: 'Google',
      fkCountry: 'United States',
      address: '1600 Amphitheatre Parkway',
      postCode: '94043',
      fkIndustryType: 'Information Technology',
      fkOrganizationType: 'Multinational',
      isActive: true,
    },
  ];

  const industryTypes = ["Information Technology", "Finance & Banking", "Telecommunication", "Infrastructure"];
  const organizationTypes = ["Government", "Private", "Non-profit", "Multinational"];


  return (
    <OrganizationCrud
        title="Organizations"
        description="Manage company and organization profiles."
        initialData={initialData}
        noun="Organization"
        industryTypes={industryTypes}
        organizationTypes={organizationTypes}
    />
    );
}
