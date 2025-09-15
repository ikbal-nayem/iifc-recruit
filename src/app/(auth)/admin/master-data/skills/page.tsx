'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ISkill } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export default function MasterSkillsPage() {
	const { toast } = useToast();
	const [skills, setSkills] = useState<ISkill[]>([]);
	const [meta, setMeta] = useState<IMeta>({ page: 1, limit: 10 });
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const loadSkills = useCallback(async (page: number, search: string) => {
		setIsLoading(true);
		try {
			const payload: IApiRequest = {
				body: { searchKey: search },
				meta: { page: page, limit: meta.limit },
			};
			const response = await MasterDataService.getSkills(payload);
			setSkills(response.body);
			setMeta(response.meta);
		} catch (error) {
			console.error('Failed to load skills', error);
			toast({
				title: 'Error',
				description: 'Failed to load skills.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}, [meta.limit, toast]);

	useEffect(() => {
		loadSkills(1, debouncedSearch);
	}, [debouncedSearch, loadSkills]);

	const handlePageChange = (newPage: number) => {
		loadSkills(newPage, debouncedSearch);
	};

	const handleAdd = async (name: string): Promise<ISkill | null> => {
		try {
			const newSkill = await MasterDataService.addSkill({ name });
			toast({ title: 'Success', description: 'Skill added successfully.', variant: 'success' });
			// Refresh list to show the new item
			loadSkills(meta.page, debouncedSearch);
			return newSkill;
		} catch (error) {
			console.error('Failed to add skill', error);
			toast({ title: 'Error', description: 'Failed to add skill.', variant: 'destructive' });
			return null;
		}
	};

	const handleUpdate = async (id: number, name: string): Promise<ISkill | null> => {
		try {
			const updatedSkill = await MasterDataService.updateSkill(id, { name });
			setSkills(skills.map(s => s.id === id ? updatedSkill : s));
			toast({ title: 'Success', description: 'Skill updated successfully.', variant: 'success' });
			return updatedSkill;
		} catch (error) {
			console.error('Failed to update skill', error);
			toast({ title: 'Error', description: 'Failed to update skill.', variant: 'destructive' });
			return null;
		}
	};

	const handleDelete = async (id: number): Promise<boolean> => {
		try {
			await MasterDataService.deleteSkill(id);
			toast({ title: 'Success', description: 'Skill deleted successfully.', variant: 'success' });
			// Refresh list
			loadSkills(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to delete skill', error);
			toast({ title: 'Error', description: 'Failed to delete skill.', variant: 'destructive' });
			return false;
		}
	};

	const handleToggle = async (id: number): Promise<ISkill | null> => {
		try {
			const updatedSkill = await MasterDataService.toggleSkillStatus(id);
			setSkills(skills.map(s => s.id === id ? updatedSkill : s));
			toast({ title: 'Success', description: 'Skill status updated.', variant: 'success' });
			return updatedSkill;
		} catch (error) {
			console.error('Failed to toggle skill status', error);
			toast({ title: 'Error', description: 'Failed to toggle skill status.', variant: 'destructive' });
			return null;
		}
	};

	return (
		<MasterDataCrud<ISkill>
			title='Skills'
			description='Manage the skills used in candidate profiles.'
			noun='Skill'
			items={skills}
			meta={meta}
			isLoading={isLoading}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onToggle={handleToggle}
			onPageChange={handlePageChange}
			onSearch={setSearchQuery}
		/>
	);
}
