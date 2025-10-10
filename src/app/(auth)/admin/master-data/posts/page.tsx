
'use client';

import { PostCrud } from '@/components/app/admin/master-data/post-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { IOutsourcingCategory, IPost } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 10 };

export default function MasterPostsPage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IPost[]>([]);
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
				const response = await MasterDataService.post.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast({
					title: 'Error',
					description: 'Failed to load posts.',
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

	const handleAdd = async (item: Omit<IPost, 'id'>): Promise<boolean> => {
		try {
			const resp = await MasterDataService.post.add(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to add item', error);
			toast({ title: 'Error', description: error.message || 'Failed to add post.', variant: 'danger' });
			return false;
		}
	};

	const handleUpdate = async (item: IPost): Promise<boolean> => {
		try {
			const resp = await MasterDataService.post.update(item);
			toast({ description: resp.message, variant: 'success' });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to update item', error);
			toast({ title: 'Error', description: error.message || 'Failed to update post.', variant: 'danger' });
			return false;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.post.delete(id);
			toast({ title: 'Success', description: 'Post deleted successfully.', variant: 'success' });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to delete item', error);
			toast({ title: 'Error', description: error.message || 'Failed to delete post.', variant: 'danger' });
			return false;
		}
	};

	return (
		<PostCrud
			title='Posts'
			description='Manage all job posts, both permanent and outsourcing.'
			noun='Post'
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
