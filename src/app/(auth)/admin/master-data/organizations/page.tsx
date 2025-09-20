
'use client';

import { OrganizationCrud } from '@/components/app/admin/organization-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState } from 'react';

const initialData: IOrganization[] = [
	{
		id: '1',
		name: 'IIFC',
		countryCode: 'BD', 
		address: 'Ede-II, 6/B, 147, Mohakhali',
		industryTypeId: '1', 
		organizationTypeId: '1',
        phone: '+88029889244',
        email: 'info@iifc.gov.bd',
        website: 'https://iifc.gov.bd',
		isActive: true,
	},
	{
		id: '2',
		name: 'Google',
		countryCode: 'US',
		address: '1600 Amphitheatre Parkway',
		industryTypeId: '2',
		organizationTypeId: '2', 
        phone: '+1-650-253-0000',
        email: 'info@google.com',
        website: 'https://google.com',
		isActive: true,
	},
];

export default function MasterOrganizationsPage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IOrganization[]>([]);
	const [countries, setCountries] = useState<ICommonMasterData[]>([]);
	const [industryTypes, setIndustryTypes] = useState<ICommonMasterData[]>([]);
	const [organizationTypes, setOrganizationTypes] = useState<ICommonMasterData[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const debouncedSearch = useDebounce(searchQuery, 500);

	// Filter states
	const [countryFilter, setCountryFilter] = useState('all');
	const [industryFilter, setIndustryFilter] = useState('all');

	
	useEffect(() => {
		const filtered = initialData
			.filter((item) => {
				if (debouncedSearch && !item.name.toLowerCase().includes(debouncedSearch.toLowerCase())) {
					return false;
				}
				if (countryFilter !== 'all' && item.countryCode !== countryFilter) {
					return false;
				}
				if (industryFilter !== 'all' && item.industryTypeId !== industryFilter) {
					return false;
				}
				return true;
			});
            setItems(filtered);
	}, [debouncedSearch, countryFilter, industryFilter]);

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
				setItems(initialData); // In a real app, this would be an API call.
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

	// This is a mock pagination meta object. In a real app, this would come from the API response.
	const meta: IMeta = {
		page: 0,
		limit: items.length,
		totalRecords: items.length,
		totalPageCount: 1,
	};


	const handleAdd = async (item: Omit<IOrganization, 'id'>): Promise<boolean> => {
		console.log('Adding', item);
		toast({ description: 'Organization added (mock).', variant: 'success' });
		// In a real app: call API, then reload items.
		return true;
	};

	const handleUpdate = async (item: IOrganization): Promise<boolean> => {
		console.log('Updating', item);
		toast({ description: 'Organization updated (mock).', variant: 'success' });
		return true;
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		console.log('Deleting', id);
		toast({ description: 'Organization deleted (mock).', variant: 'success' });
		return true;
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
			onPageChange={() => {}}
			onSearch={setSearchQuery}
			countryFilter={countryFilter}
			onCountryChange={setCountryFilter}
			industryFilter={industryFilter}
			onIndustryChange={setIndustryFilter}
		/>
	);
}
