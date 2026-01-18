
'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data/master-data-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 20, totalRecords: 0 };

export default function MasterCertificationsPage() {
	const [items, setItems] = useState<ICommonMasterData[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const loadItems = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { nameEn: search },
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.certification.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast.error({
					title: 'Error',
					description: 'Failed to load certifications.',
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

	const handleAdd = async (data: { nameEn: string, nameBn: string }): Promise<boolean | null> => {
		try {
			const resp = await MasterDataService.certification.add({ ...data, active: true });
			toast.success({ description: resp.message });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast.error({ title: 'Error', description: 'Failed to add certification.' });
			return null;
		}
	};

	const handleUpdate = async (item: ICommonMasterData): Promise<boolean | null> => {
		try {
			const updatedItem = await MasterDataService.certification.update(item);
			toast.success({ description: updatedItem?.message });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast.error({ title: 'Error', description: 'Failed to update certification.' });
			return null;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.certification.delete(id);
			toast.success({ title: 'Success', description: 'Certification deleted successfully.' });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast.error({ title: 'Error', description: 'Failed to delete certification.' });
			return false;
		}
	};

	return (
		<MasterDataCrud
			title='Certifications'
			description='Manage professional certifications.'
			noun='Certification'
			items={items}
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
