import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { candidates } from '@/lib/data';

export default function MasterLanguagesPage() {
  const languages = Array.from(new Set(candidates.flatMap(c => c.languages.map(l => l.name)))).map(name => ({ name, isActive: true }));

  return (
    <MasterDataCrud 
        title="Languages"
        description="Manage the languages used in candidate profiles."
        initialData={languages}
        noun="Language"
    />
    );
}