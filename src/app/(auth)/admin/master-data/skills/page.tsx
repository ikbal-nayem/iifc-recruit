'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ISkill } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState } from 'react';

export default function MasterSkillsPage() {
	const [skills, setSkills] = useState<Array<ISkill>>([]);
	const [meta, setMeta] = useState<IMeta>({ page: 0, limit: 20 });

	useEffect(() => {
		const loadSkills = async () => {
			try {
				const payload: IApiRequest = {
					body: { searchKey: '' },
					meta: { page: meta.page, limit: meta.limit },
				};
				const response = await MasterDataService.getSkills(payload);
				setSkills(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load skills', error);
			}
		};
		loadSkills();
	}, [meta.page, meta.limit]);

	return (
		<MasterDataCrud
			title='Skills'
			description='Manage the skills used in candidate profiles.'
			initialData={skills}
			noun='Skill'
		/>
	);
}
