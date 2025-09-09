
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { candidates } from '@/lib/data';

export default function MasterSkillsPage() {
  const skills = Array.from(new Set(candidates.flatMap(c => c.skills))).map(name => ({ name, isActive: true }));

  return (
    <MasterDataCrud 
        title="Skills"
        description="Manage the skills used in candidate profiles."
        initial