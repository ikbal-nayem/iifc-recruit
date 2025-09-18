'use client';

import { MasterDataCrud } from '@/components/app/admin/master-data-crud';
import { STATUS_TYPE } from '@/constants/common.constant';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { IStatus } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 999 };

export default function MasterJobStatusesPage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IStatus[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	const loadItems = useCallback(
		async (search: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: { name: search, statusType: STATUS_TYPE.JOB },
					meta: initMeta,
				};
				const response = await MasterDataService.status.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load job statuses.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
	);

	useEffect(() => {
		loadItems(debouncedSearch);
	}, [debouncedSearch, loadItems]);

	const handleAdd = async (name: string): Promise<boolean | null> => {
		try {
			const resp = await MasterDataService.status.add({ name, statusType: STATUS_TYPE.JOB, isActive: true });
			toast({ description: resp.message, variant: 'success' });
			loadItems(debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast({ title: 'Error', description: 'Failed to add job status.', variant: 'destructive' });
			return null;
		}
	};

	const handleUpdate = async (item: IStatus): Promise<boolean | null> => {
		try {
			const updatedItem = await MasterDataService.status.update(item);
			toast({ description: updatedItem?.message, variant: 'success' });
			loadItems(debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: 'Failed to update job status.', variant: 'destructive' });
			return null;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.status.delete(id);
			toast({ title: 'Success', description: 'Job status deleted successfully.', variant: 'success' });
			loadItems(debouncedSearch);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast({ title: 'Error', description: 'Failed to delete job status.', variant: 'destructive' });
			return false;
		}
	};

	return (
		<MasterDataCrud<IStatus>
			title='Job Statuses'
			description='Manage the statuses used for job postings (e.g., Open, Closed).'
			noun='Status'
			items={items}
			meta={meta}
			isLoading={isLoading}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onSearch={setSearchQuery}
		/>
	);
}
