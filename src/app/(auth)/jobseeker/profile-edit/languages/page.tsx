
import { ProfileFormLanguages } from '@/components/app/jobseeker/profile-forms/languages';
import { MasterDataService } from '@/services/api/master-data.service';

export default async function JobseekerProfileLanguagesPage() {
	const [masterLanguagesRes, proficiencyRes] = await Promise.allSettled([
		MasterDataService.language.get(),
		MasterDataService.getEnum('proficiency-level'),
	]);

	const languageOptions = masterLanguagesRes.status === 'fulfilled' ? masterLanguagesRes.value.body : [];
	const proficiencyOptions = proficiencyRes.status === 'fulfilled' ? proficiencyRes.value.body : [];

	if (masterLanguagesRes.status === 'rejected') {
		console.error('Failed to load languages:', masterLanguagesRes.reason);
	}
	if (proficiencyRes.status === 'rejected') {
		console.error('Failed to load proficiency levels:', proficiencyRes.reason);
	}

	return <ProfileFormLanguages languageOptions={languageOptions} proficiencyOptions={proficiencyOptions} />;
}
