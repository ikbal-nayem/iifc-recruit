import { ProfileFormSkills } from '@/components/app/jobseeker/profile-forms/skills';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';

async function getProficiencyLevels(): Promise<EnumDTO[]> {
	try {
		const response = await MasterDataService.getEnum('proficiency-level');
		return response.body as EnumDTO[];
	} catch (error) {
		console.error('Failed to load proficiency levels:', error);
		return [];
	}
}

export default async function JobseekerProfileSkillsPage() {
	const proficiencyOptions = await getProficiencyLevels();

	return <ProfileFormSkills proficiencyOptions={proficiencyOptions} />;
}
