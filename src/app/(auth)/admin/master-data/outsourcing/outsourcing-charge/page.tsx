
'use client';

import { OutsourcingChargeCrud } from '@/components/app/admin/outsourcing-charge-crud';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { IOutsourcingCategory, IOutsourcingCharge, IOutsourcingZone } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 10 };

export default function MasterOutsourcingChargePage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IOutsourcingCharge[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [categories, setCategories] = useState<IOutsourcingCategory[]>([]);
	const [zones, setZones] = useState<IOutsourcingZone[]>([]);

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
				toast({
					title: 'Error',
					description: 'Failed to load master data.',
					variant: 'danger',
				});
			}
		};
		fetchMasterData();
	}, [toast]);

	const loadItems = useCallback(
		async (page: number) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.outsourcingCharge.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load outsourcing charges.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		loadItems(0);
	}, [loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage);
	};

	const handleAdd = async (item: Omit<IOutsourcingCharge, 'id'>): Promise<boolean> => {
		try {
			const resp = await MasterDataService.outsourcingCharge.add(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast({ title: 'Error', description: 'Failed to add outsourcing charge.', variant: 'danger' });
			return false;
		}
	};

	const handleUpdate = async (item: IOutsourcingCharge): Promise<boolean> => {
		try {
			const resp = await MasterDataService.outsourcingCharge.update(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page);
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: 'Failed to update outsourcing charge.', variant: 'danger' });
			return false;
		}
	};

	const handleDelete = async (id: number): Promise<boolean> => {
		try {
			await MasterDataService.outsourcingCharge.delete(id.toString());
			toast({ title: 'Success', description: 'Outsourcing charge deleted successfully.', variant: 'success' });
			loadItems(meta.page);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast({ title: 'Error', description: 'Failed to delete outsourcing charge.', variant: 'danger' });
			return false;
		}
	};

	return (
		<OutsourcingChargeCrud
			title='Outsourcing Charges'
			description='Manage monthly service charges for different categories and zones.'
			noun='Charge'
			items={items}
			meta={meta}
			isLoading={isLoading}
			categories={categories}
			zones={zones}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onPageChange={handlePageChange}
		/>
	);
}
