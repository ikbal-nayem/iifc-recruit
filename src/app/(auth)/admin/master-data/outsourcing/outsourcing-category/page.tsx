'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';
import { IOutsourcingCategory } from '@/interfaces/master-data.interface';
import { OutsourcingCategoryCrud } from '@/components/app/admin/outsourcing-category-crud';

const initMeta: IMeta = { page: 0, limit: 20 };

export default function MasterOutsourcingCategoryPage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IOutsourcingCategory[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const loadItems = useCallback(
		async (page: number, search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { name: search },
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.outsourcingCategory.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load outsourcing categories.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		loadItems(0, debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch);
	};

	const handleAdd = async (data: { nameEn: string; nameBn: string }): Promise<boolean | null> => {
		try {
			const resp = await MasterDataService.outsourcingCategory.add({ ...data, isActive: true });
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast({ title: 'Error', description: 'Failed to add outsourcing category.', variant: 'danger' });
			return null;
		}
	};

	const handleUpdate = async (item: IOutsourcingCategory): Promise<boolean | null> => {
		try {
			const updatedItem = await MasterDataService.outsourcingCategory.update(item);
			setItems(items.map((i) => (i?.id === item?.id ? updatedItem?.body : i)));
			toast({ description: updatedItem?.message, variant: 'success' });
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: 'Failed to update outsourcing category.', variant: 'danger' });
			return null;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.outsourcingCategory.delete(id);
			toast({ title: 'Success', description: 'Outsourcing category deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast({ title: 'Error', description: 'Failed to delete outsourcing category.', variant: 'danger' });
			return false;
		}
	};

	return (
		<OutsourcingCategoryCrud
			title='Outsourcing Categories'
			description='Manage outsourcing categories.'
			noun='Outsourcing Category'
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
