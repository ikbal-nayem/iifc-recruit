'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data/master-data-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 20 };

export default function MasterSkillsPage() {
	const [skills, setSkills] = useState<ICommonMasterData[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const loadSkills = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { nameEn: search },
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.skill.getList(payload);
				setSkills(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load skills', error);
				toast.error({
					title: 'Error',
					description: 'Failed to load skills.',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	useEffect(() => {
		loadSkills(0, debouncedSearch);
	}, [debouncedSearch, loadSkills]);

	const handlePageChange = (newPage: number) => {
		loadSkills(newPage, debouncedSearch);
	};

	const handleAdd = async (data: { nameEn: string, nameBn: string }): Promise<boolean | null> => {
		try {
			const resp = await MasterDataService.skill.add({ ...data, active: true });
			toast.success({ description: resp.message || "Skill added succesfully." });
			// Refresh list to show the new item
			loadSkills(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to add skill', error);
			toast.error({ title: 'Error', description: 'Failed to add skill.' });
			return null;
		}
	};

	const handleUpdate = async (item: ICommonMasterData): Promise<boolean | null> => {
		try {
			const updatedSkill = await MasterDataService.skill.update(item);
			setSkills(skills.map((s) => (s?.id === item?.id ? updatedSkill?.body : s)));
			toast.success({ description: updatedSkill?.message || "Skill updated succesfully" });
			return true;
		} catch (error) {
			console.error('Failed to update skill', error);
			toast.error({ title: 'Error', description: 'Failed to update skill.' });
			return null;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.skill.delete(id);
			toast.success({ title: 'Success', description: 'Skill deleted successfully.' });
			loadSkills(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to delete skill', error);
			toast.error({ title: 'Error', description: 'Failed to delete skill.' });
			return false;
		}
	};

	return (
		<MasterDataCrud
			title='Skills'
			description='Manage the skills used in candidate profiles.'
			noun='Skill'
			items={skills}
			meta={meta}
			isLoading={isLoading}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onPageChange={handlePageChange}
			onSearch={setSearchQuery}
		/>
	);
}
