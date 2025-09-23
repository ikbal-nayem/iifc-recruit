'use client';

import { EducationInstitutionCrud } from '@/components/app/admin/education-institution-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IEducationInstitution } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 10 };

export default function MasterInstitutionsPage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IEducationInstitution[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);
	const [countryFilter, setCountryFilter] = useState('all');
	const [countries, setCountries] = useState<ICommonMasterData[]>([]);

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				const response = await MasterDataService.country.get();
				setCountries(response.body);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to load countries.',
					variant: 'danger',
				});
			}
		};
		fetchCountries();
	}, [toast]);

	const loadItems = useCallback(
		async (page: number, search: string, countryId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						name: search,
						...(countryId !== 'all' && { countryId }),
					},
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.educationInstitution.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load institutions.',
					variant: 'danger',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		loadItems(0, debouncedSearch, countryFilter);
	}, [debouncedSearch, countryFilter, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch, countryFilter);
	};

	const handleAdd = async (item: Omit<IEducationInstitution, 'id'>): Promise<boolean> => {
		try {
			const resp = await MasterDataService.educationInstitution.add(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast({ title: 'Error', description: 'Failed to add institution.', variant: 'danger' });
			return false;
		}
	};

	const handleUpdate = async (item: IEducationInstitution): Promise<boolean> => {
		try {
			const resp = await MasterDataService.educationInstitution.update(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter);
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: 'Failed to update institution.', variant: 'danger' });
			return false;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.educationInstitution.delete(id);
			toast({ title: 'Success', description: 'Institution deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast({ title: 'Error', description: 'Failed to delete institution.', variant: 'danger' });
			return false;
		}
	};

	return (
		<EducationInstitutionCrud
			title='Education Institutions'
			description='Manage universities, colleges, and other educational institutions.'
			noun='Institution'
			items={items}
			meta={meta}
			isLoading={isLoading}
			countries={countries}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onPageChange={handlePageChange}
			onSearch={setSearchQuery}
			countryFilter={countryFilter}
			onCountryChange={setCountryFilter}
		/>
	);
}
