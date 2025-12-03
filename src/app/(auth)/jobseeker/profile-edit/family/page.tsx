
'use client';

import { ProfileFormFamily } from '@/components/app/jobseeker/profile-forms/family';
import { IApiResponse } from '@/interfaces/common.interface';
import { ChildInfo, FamilyInfo } from '@/interfaces/jobseeker.interface';
import { EnumDTO, ICommonMasterData } from '@/interfaces/master-data.interface';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState } from 'react';

type MasterData = {
	districts: ICommonMasterData[];
	spouseStatuses: EnumDTO[];
	genders: EnumDTO[];
};

export default function JobseekerProfileFamilyPage() {
	const [masterData, setMasterData] = useState<MasterData>({
		districts: [],
		spouseStatuses: [],
		genders: [],
	});
	const [familyInfo, setFamilyInfo] = useState<FamilyInfo>();

	useEffect(() => {
		const loadMasterData = async () => {
			const [districtsRes, spouseStatusRes, genderRes, familyInfoRes] = await Promise.allSettled([
				MasterDataService.country.getDistricts('6'), // Assuming Bangladesh division ID is 6
				MasterDataService.getEnum('spouse-status'),
				MasterDataService.getEnum('gender'),
				JobseekerProfileService.spouse.get(),
			]);

			const getFulfilledValue = <T,>(
				result: PromiseSettledResult<IApiResponse<T[]>>,
				defaultValue: T[] = []
			): T[] => {
				if (result.status === 'fulfilled' && Array.isArray(result.value.body)) {
					return result.value.body;
				}
				return defaultValue;
			};
			setFamilyInfo(familyInfoRes.status === 'fulfilled' ? familyInfoRes.value.body : undefined);
			setMasterData({
				districts: getFulfilledValue(districtsRes as PromiseSettledResult<IApiResponse<ICommonMasterData[]>>),
				spouseStatuses: getFulfilledValue(spouseStatusRes as PromiseSettledResult<IApiResponse<EnumDTO[]>>),
				genders: getFulfilledValue(genderRes as PromiseSettledResult<IApiResponse<EnumDTO[]>>),
			});
		};

		loadMasterData();
	}, []);

	return (
		<ProfileFormFamily
			districts={masterData.districts}
			initialData={familyInfo}
			spouseStatuses={masterData.spouseStatuses}
			genders={masterData.genders}
		/>
	);
}
