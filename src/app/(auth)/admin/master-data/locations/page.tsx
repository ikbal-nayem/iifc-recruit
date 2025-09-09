
import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { jobs } from '@/lib/data';

export default function MasterLocationsPage() {
  const locations = Array.from(new Set(jobs.map(j => j.location)));

  return (
    <MasterDataCrud 
        title="Locations"
        description="Manage the locations used for job postings."
        initialData={locations}
        noun="Location"
    />
    );
}
