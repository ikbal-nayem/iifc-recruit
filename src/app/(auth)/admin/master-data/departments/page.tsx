'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 1, limit: 20 };

export default function MasterDepartmentsPage() {
	const { toast } = useToast();
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
					body: { searchKey: search },
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.department.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load departments.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		loadItems(1, debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const handleAdd = async (name: string): Promise<boolean | null> => {
		try {
			const resp = await MasterDataService.department.add({ name, isActive: true });
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast({ title: 'Error', description: 'Failed to add department.', variant: 'destructive' });
			return null;
		}
	};

	const handleUpdate = async (item: ICommonMasterData): Promise<boolean | null> => {
		try {
			const updatedItem = await MasterDataService.department.update(item);
			setItems(items.map((i) => (i?.id === item?.id ? updatedItem?.body : i)));
			toast({ description: updatedItem?.message, variant: 'success' });
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: 'Failed to update department.', variant: 'destructive' });
			return null;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.department.delete(id);
			toast({ title: 'Success', description: 'Department deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast({ title: 'Error', description: 'Failed to delete department.', variant: 'destructive' });
			return false;
		}
	};

	return (
		<MasterDataCrud<ICommonMasterData>
			title='Departments'
			description='Manage the departments used for job postings.'
			noun='Department'
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
