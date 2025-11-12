'use client';

import { PostCrud } from '@/components/app/admin/master-data/post-crud';
import { useDebounce } from '@/hooks/use-debounce';
import { toast } from '@/hooks/use-toast';
import { IApiRequest, IMeta } from '@/interfaces/common.interface';
import { IOutsourcingCategory, IPost } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 10 };

export default function MasterPostsPage() {
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
				toast.error({
					description: 'Failed to load categories.',
				});
			}
		};
		fetchCategories();
	}, []);

	const loadItems = useCallback(
		async (page: number, search: string, categoryId: string) => {
			setIsLoading(true);
			try {
				const payload: IApiRequest = {
					body: {
						searchKey: search,
						...(categoryId !== 'all' && { outsourcingCategoryId: categoryId }),
					},
					meta: { page: page, limit: meta.limit },
				};
				const response = await MasterDataService.post.getList(payload);
				setItems(response.body);
				setMeta(response.meta);
			} catch (error) {
				console.error('Failed to load items', error);
				toast.error({ description: 'Failed to load posts.' });
			} finally {
				setIsLoading(false);
			}
		},
		[meta.limit]
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
			toast.success({ description: resp.message });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to add item', error);
			toast.error({ description: error.message || 'Failed to add post.' });
			return false;
		}
	};

	const handleUpdate = async (item: IPost): Promise<boolean> => {
		try {
			const resp = await MasterDataService.post.update(item);
			toast.success({ description: resp.message });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to update item', error);
			toast.error({ description: error.message || 'Failed to update post.' });
			return false;
		}
	};

	const handleDelete = async (id: string): Promise<boolean> => {
		try {
			await MasterDataService.post.delete(id);
			toast.success({ description: 'Post deleted successfully.' });
			loadItems(meta.page, debouncedSearch, categoryFilter);
			return true;
		} catch (error: any) {
			console.error('Failed to delete item', error);
			toast.error({ description: error.message || 'Failed to delete post.' });
			return false;
		}
	};

	return (
		<PostCrud
			title='Posts'
			description='Manage all job posts, both permanent and outsourcing.'
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
