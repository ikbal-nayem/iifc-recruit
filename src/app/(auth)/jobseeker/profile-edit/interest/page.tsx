import { ProfileFormInterest } from '@/components/app/jobseeker/profile-forms/interest';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

async function getMasterData(): Promise<{
	categories: ICommonMasterData[];
}> {
	try {
		const [categoriesRes] = await Promise.allSettled([MasterDataService.outsourcingCategory.get()]);

		const categories = categoriesRes.status === 'fulfilled' ? categoriesRes.value.body : [];

		return { categories };
	} catch (error) {
		console.error('Failed to load master data for interest form', error);
		return { categories: [] };
	}
}

export default async function JobseekerProfileInterestPage() {
	const { categories } = await getMasterData();
	return <ProfileFormInterest categories={categories} />;
}
