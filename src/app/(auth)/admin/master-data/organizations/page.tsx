
'use client';

import { OrganizationCrud } from '@/components/app/admin/organization-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IMeta } from '@/interfaces/common.interface';
import { ICommonMasterData, IOrganization } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useEffect, useState, useMemo } from 'react';

const initialData: IOrganization[] = [
	{
		id: '1',
		name: 'IIFC',
		fkCountry: '1', // Assuming '1' is Bangladesh
		address: 'Ede-II, 6/B, 147, Mohakhali',
		postCode: '1212',
		fkIndustryType: '1', // Example
		fkOrganizationType: '1', // Example
		isActive: true,
	},
	{
		id: '2',
		name: 'Google',
		fkCountry: '3', // Assuming '3' is United States
		address: '1600 Amphitheatre Parkway',
		postCode: '94043',
		fkIndustryType: '2', // Example
		fkOrganizationType: '2', // Example
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

	// Memoize filtered items
	const filteredItems = useMemo(() => {
		return initialData
			.filter((item) => {
				if (debouncedSearch && !item.name.toLowerCase().includes(debouncedSearch.toLowerCase())) {
					return false;
				}
				if (countryFilter !== 'all' && item.fkCountry !== countryFilter) {
					return false;
				}
				if (industryFilter !== 'all' && item.fkIndustryType !== industryFilter) {
					return false;
				}
				return true;
			});
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
		limit: filteredItems.length,
		totalRecords: filteredItems.length,
		totalPageCount: 1,
	};


	const handleNoOp = async () => {
		console.log('This is a mock operation.');
		return true;
	};

	return (
		<OrganizationCrud
			title='Organizations'
			description='Manage company and organization profiles.'
			items={filteredItems}
			meta={meta}
			isLoading={isLoading}
			noun='Organization'
			countries={countries}
			industryTypes={industryTypes}
			organizationTypes={organizationTypes}
			onAdd={async () => handleNoOp()}
			onUpdate={async () => handleNoOp()}
			onDelete={async () => handleNoOp()}
			onPageChange={() => {}}
			onSearch={setSearchQuery}
			countryFilter={countryFilter}
			onCountryChange={setCountryFilter}
			industryFilter={industryFilter}
			onIndustryChange={setIndustryFilter}
		/>
	);
}
