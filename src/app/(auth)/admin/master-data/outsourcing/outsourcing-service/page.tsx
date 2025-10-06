
'use client';

import { OutsourcingServiceCrud } from '@/components/app/admin/outsourcing-service-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { IOutsourcingCategory, IOutsourcingService } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 10 };

export default function MasterOutsourcingServicePage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IOutsourcingService[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [categories, setCategories] = useState<IOutsourcingCategory[]>([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await MasterDataService.outsourcingCategory.get();
				setCategories(response.body);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to load categories.',
					variant: 'danger',
				});
			}
		};
		fetchCategories();
	}, [toast]);

	const loadItems = useCallback(
		async (page: number, search: string, categoryId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						nameEn: search,
						...(categoryId !== 'all' && { categoryId }),
					},
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.outsourcingService.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load services.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		loadItems(0, debouncedSearch, categoryFilter);
	}, [debouncedSearch, categoryFilter, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch, categoryFilter);
	};

	const handleAdd = async (item: Omit<IOutsourcingService, 'id'>): Promise<boolean> => {
		try {
			const resp = await MasterDataService.outsourcingService.add(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast({ title: 'Error', description: 'Failed to add service.', variant: 'danger' });
			return false;
		}
	};

	const handleUpdate = async (item: IOutsourcingService): Promise<boolean> => {
		try {
			const resp = await MasterDataService.outsourcingService.update(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: 'Failed to update service.', variant: 'danger' });
			return false;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.outsourcingService.delete(id);
			toast({ title: 'Success', description: 'Service deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast({ title: 'Error', description: 'Failed to delete service.', variant: 'danger' });
			return false;
		}
	};

	return (
		<OutsourcingServiceCrud
			title='Outsourcing Services'
			description='Manage outsourcing services.'
			noun='Service'
			items={items}
			meta={meta}
			isLoading={isLoading}
			categories={categories}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onPageChange={handlePageChange}
			onSearch={setSearchQuery}
			categoryFilter={categoryFilter}
			onCategoryChange={setCategoryFilter}
		/>
	);
}

