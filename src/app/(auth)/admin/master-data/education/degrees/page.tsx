
'use client';

import { EducationDegreeCrud } from '@/components/app/admin/master-data/education-degree-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IEducationDegree } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 20 };

export default function MasterDegreesPage() {
	const [items, setItems] = useState<IEducationDegree[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const [degreeLevels, setDegreeLevels] = useState<ICommonMasterData[]>([]);

	useEffect(() => {
		const fetchDegreeLevels = async () => {
			try {
				const response = await MasterDataService.degreeLevel.get();
				setDegreeLevels(response.body);
			} catch (error) {
				toast.error({
					description: 'Failed to load degree levels.',
				});
			}
		};
		fetchDegreeLevels();
	}, []);

	const loadItems = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { nameEn: search },
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.educationDegree.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error: any) {
				console.error('Failed to load items', error);
				toast.error({
					description: error.message || 'Failed to load degrees.',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	useEffect(() => {
		loadItems(0, debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const handleAdd = async (item: Omit<IEducationDegree, 'id'>): Promise<boolean> => {
		try {
			const resp = await MasterDataService.educationDegree.add(item);
			toast.success({ description: resp.message });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error: any) {
			console.error('Failed to add item', error);
			toast.error({ description: error.message || 'Failed to add degree.' });
			return false;
		}
	};

	const handleUpdate = async (item: IEducationDegree): Promise<boolean> => {
		try {
			const resp = await MasterDataService.educationDegree.update(item);
			toast.success({ description: resp.message });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error: any) {
			console.error('Failed to update item', error);
			toast.error({ title: 'Error', description: error.message || 'Failed to update degree.' });
			return false;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.educationDegree.delete(id);
			toast.success({ description: 'Degree deleted successfully.' });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error: any) {
			console.error('Failed to delete item', error);
			toast.error({ description: error.message || 'Failed to delete degree.' });
			return false;
		}
	};

	return (
		<EducationDegreeCrud
			title='Degrees'
			description='Manage academic degrees.'
			noun='Degree'
			items={items}
			meta={meta}
			isLoading={isLoading}
			degreeLevels={degreeLevels}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onPageChange={handlePageChange}
			onSearch={setSearchQuery}
		/>
	);
}
