'use client';

import { OutsourcingChargeCrud } from '@/components/app/admin/master-data/outsourcing-charge-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import {
	IOutsourcingCategory,
	IOutsourcingCharge,
	IOutsourcingZone,
} from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 20 };

export default function MasterOutsourcingChargePage() {
	const [items, setItems] = useState<IOutsourcingCharge[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [categories, setCategories] = useState<IOutsourcingCategory[]>([]);
	const [zones, setZones] = useState<IOutsourcingZone[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [zoneFilter, setZoneFilter] = useState('all');
	const debouncedSearch = useDebounce(searchQuery, 500);

	useEffect(() => {
		const fetchMasterData = async () => {
			try {
				const [catRes, zoneRes] = await Promise.all([
					MasterDataService.outsourcingCategory.get(),
					MasterDataService.outsourcingZone.get(),
				]);
				setCategories(catRes.body);
				setZones(zoneRes.body);
			} catch (error) {
				toast.error({
					description: 'Failed to load master data.',
				});
			}
		};
		fetchMasterData();
	}, []);

	const loadItems = useCallback(
		async (page: number, search: string, categoryId: string, zoneId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						...(search && { monthlyServiceCharge: search }),
						...(categoryId !== 'all' && { categoryId }),
						...(zoneId !== 'all' && { zoneId }),
					},
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.outsourcingCharge.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast.error({
					description: 'Failed to load outsourcing charges.',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	useEffect(() => {
		loadItems(0, debouncedSearch, categoryFilter, zoneFilter);
	}, [loadItems, debouncedSearch, categoryFilter, zoneFilter]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch, categoryFilter, zoneFilter);
	};

	const handleAdd = async (item: Omit<IOutsourcingCharge, 'id'>): Promise<boolean> => {
		try {
			const resp = await MasterDataService.outsourcingCharge.add(item);
			toast.success({ description: resp.message });
			loadItems(meta.page, debouncedSearch, categoryFilter, zoneFilter);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast.error({ title: 'Error', description: 'Failed to add outsourcing charge.' });
			return false;
		}
	};

	const handleUpdate = async (item: IOutsourcingCharge): Promise<boolean> => {
		try {
			const resp = await MasterDataService.outsourcingCharge.update(item);
			toast.success({ description: resp.message });
			loadItems(meta.page, debouncedSearch, categoryFilter, zoneFilter);
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast.error({ title: 'Error', description: 'Failed to update outsourcing charge.' });
			return false;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.outsourcingCharge.delete(id.toString());
			toast.success({
				title: 'Success',
				description: 'Outsourcing charge deleted successfully.',
			});
			loadItems(meta.page, debouncedSearch, categoryFilter, zoneFilter);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast.error({ description: 'Failed to delete outsourcing charge.' });
			return false;
		}
	};

	return (
		<OutsourcingChargeCrud
			title='Outsourcing Charges'
			description='Manage monthly service charges for different categories and zones.'
			noun='Outsourcing Charge'
			items={items}
			meta={meta}
			isLoading={isLoading}
			categories={categories}
			zones={zones}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onPageChange={handlePageChange}
			onSearch={setSearchQuery}
			categoryFilter={categoryFilter}
			onCategoryChange={setCategoryFilter}
			zoneFilter={zoneFilter}
			onZoneChange={setZoneFilter}
		/>
	);
}
