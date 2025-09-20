'use client';

import { OrganizationCrud } from '@/components/app/admin/organization-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 10 };

export default function MasterOrganizationsPage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IOrganization[]>([]);
	const [countries, setCountries] = useState<ICommonMasterData[]>([]);
	const [industryTypes, setIndustryTypes] = useState<ICommonMasterData[]>([]);
	const [organizationTypes, setOrganizationTypes] = useState<ICommonMasterData[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);

	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	// Filter states
	const [countryFilter, setCountryFilter] = useState('all');
	const [industryFilter, setIndustryFilter] = useState('all');

	const loadItems = useCallback(
		async (page: number, search: string, countryId: string, industryId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						name: search,
						...(countryId !== 'all' && { countryCode: countryId }),
						...(industryId !== 'all' && { industryTypeId: industryId }),
					},
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.organization.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load organizations.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit, toast]
	);

	useEffect(() => {
		const fetchInitialData = async () => {
			setIsLoading(true);
			try {
				const [countriesRes, industryTypesRes, orgTypesRes] = await Promise.all([
					MasterDataService.country.get(),
					MasterDataService.industryType.get(),
					MasterDataService.organizationType.get(),
				]);
				setCountries(countriesRes.body);
				setIndustryTypes(industryTypesRes.body);
				setOrganizationTypes(orgTypesRes.body);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to load initial data for the form.',
					variant: 'destructive',
				});
			} finally {
				setIsLoading(false);
			}
		};
		fetchInitialData();
	}, [toast]);

	useEffect(() => {
		loadItems(0, debouncedSearch, countryFilter, industryFilter);
	}, [debouncedSearch, countryFilter, industryFilter, loadItems]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage, debouncedSearch, countryFilter, industryFilter);
	};

	const handleAdd = async (item: Omit<IOrganization, 'id'>): Promise<boolean> => {
		try {
			const resp = await MasterDataService.organization.add(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter, industryFilter);
			return true;
		} catch (error) {
			console.error('Failed to add item', error);
			toast({ title: 'Error', description: 'Failed to add organization.', variant: 'destructive' });
			return false;
		}
	};

	const handleUpdate = async (item: IOrganization): Promise<boolean> => {
		try {
			const resp = await MasterDataService.organization.update(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter, industryFilter);
			return true;
		} catch (error) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: 'Failed to update organization.', variant: 'destructive' });
			return false;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.organization.delete(id);
			toast({ title: 'Success', description: 'Organization deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch, countryFilter, industryFilter);
			return true;
		} catch (error) {
			console.error('Failed to delete item', error);
			toast({ title: 'Error', description: 'Failed to delete organization.', variant: 'destructive' });
			return false;
		}
	};

	return (
		<OrganizationCrud
			title='Organizations'
			description='Manage company and organization profiles.'
			items={items}
			meta={meta}
			isLoading={isLoading}
			noun='Organization'
			countries={countries}
			industryTypes={industryTypes}
			organizationTypes={organizationTypes}
			onAdd={handleAdd}
			onUpdate={handleUpdate}
			onDelete={handleDelete}
			onPageChange={handlePageChange}
			onSearch={setSearchQuery}
			countryFilter={countryFilter}
			onCountryChange={setCountryFilter}
			industryFilter={industryFilter}
			onIndustryChange={setIndustryFilter}
		/>
	);
}
