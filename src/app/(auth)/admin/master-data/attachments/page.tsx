
'use client';

import { AttachmentCrud } from '@/components/app/admin/master-data/attachment-crud';
import { useToast } from '@/hooks/use-toast';
import { IApiRequest, IAttachment, IMeta } from '@/interfaces/common.interface';
import { EnumDTO } from '@/interfaces/master-data.interface';
import { AttachmentService } from '@/services/api/attachment.service';
import { MasterDataService } from '@/services/api/master-data.service';
import React, { useCallback, useEffect, useState } from 'react';

const initMeta: IMeta = { page: 0, limit: 10, totalRecords: 0 };

export default function MasterAttachmentsPage() {
	const { toast } = useToast();
	const [items, setItems] = useState<IAttachment[]>([]);
	const [meta, setMeta] = useState<IMeta>(initMeta);
	const [isLoading, setIsLoading] = useState(true);
	const [attachmentTypes, setAttachmentTypes] = useState<EnumDTO[]>([]);

	const loadItems = useCallback(async (page: number) => {
		setIsLoading(true);
		try {
			const payload: IApiRequest = { meta: { page, limit: meta.limit } };
			const response = await AttachmentService.getList(payload);
			setItems(response.body);
			setMeta(response.meta);
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to load attachments.' });
		} finally {
			setIsLoading(false);
		}
	}, [meta.limit, toast]);

	useEffect(() => {
		loadItems(0);
	}, [loadItems]);

	useEffect(() => {
		MasterDataService.getEnum('attachemnt-type')
			.then((res) => setAttachmentTypes(res.body as EnumDTO[]))
			.catch(() => toast.error({ description: 'Failed to load attachment types.' }));
	}, [toast]);

	const handlePageChange = (newPage: number) => {
		loadItems(newPage);
	};

	const handleAdd = async (data: FormData): Promise<boolean> => {
		try {
			await AttachmentService.save(data);
			toast.success({ description: 'Attachment uploaded successfully.' });
			loadItems(0);
			return true;
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to upload attachment.' });
			return false;
		}
	};

	const handleSetDefault = async (item: IAttachment) => {
		try {
			await AttachmentService.save(
				new FormData(),
				{
					...item,
					isDefault: !item.isDefault,
				},
				true
			);
			toast.success({ description: 'Default status updated.' });
			loadItems(meta.page);
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to update default status.' });
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await AttachmentService.delete(id);
			toast.success({ description: 'Attachment deleted successfully.' });
			loadItems(0); // Go back to the first page after deletion
		} catch (error: any) {
			toast.error({ description: error.message || 'Failed to delete attachment.' });
		}
	};

	return (
		<AttachmentCrud
			title='Attachments'
			description='Manage portal attachments like notices, forms, etc.'
			noun='Attachment'
			items={items}
			meta={meta}
			isLoading={isLoading}
			attachmentTypes={attachmentTypes}
			onAdd={handleAdd}
			onDelete={handleDelete}
			onSetDefault={handleSetDefault}
			onPageChange={handlePageChange}
		/>
	);
}

