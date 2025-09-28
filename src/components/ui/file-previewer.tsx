
'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { IFile } from '@/interfaces/common.interface';
import { makeDownloadURL, makePreviewURL } from '@/lib/utils';
import { Download, ExternalLink, Loader2, Maximize, Minimize, X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { isFileImage, isFilePdf } from '@/lib/file-type-checker';

type FilePreviewerProps = {
	file: IFile | File;
	children: React.ReactNode;
	className?: string;
};

export function FilePreviewer({ file, children, className }: FilePreviewerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isMaximized, setIsMaximized] = useState(false);
	const [previewUrl, setPreviewUrl] = useState('');
	const { toast } = useToast();

	const isFileObject = file instanceof File;
	const fileType = isFileObject ? file.type : file.fileType;
	const fileName = isFileObject ? file.name : file.originalFileName;
	const filePath = isFileObject ? '' : file.filePath;

	const canBePreviewed = isFileImage(fileType) || isFilePdf(fileType);

	const handleDownload = () => {
		const url = isFileObject ? URL.createObjectURL(file) : makeDownloadURL(filePath);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		if (!isFileObject) {
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener noreferrer');
		}
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		if (isFileObject) {
			URL.revokeObjectURL(url);
		}
	};

	const handleOpen = async () => {
		if (!canBePreviewed) {
			handleDownload();
			return;
		}

		setIsOpen(true);
		setIsLoading(true);

		try {
			if (isFileObject) {
				setPreviewUrl(URL.createObjectURL(file));
			} else {
				const response = await fetch(makePreviewURL(filePath));
				if (!response.ok) {
					throw new Error('Failed to fetch file for preview');
				}
				const blob = await response.blob();
				setPreviewUrl(URL.createObjectURL(blob));
			}
		} catch (error) {
			console.error('Failed to load file for preview:', error);
			toast({
				title: 'Error',
				description: 'Could not load file for preview.',
				variant: 'danger',
			});
			setIsOpen(false);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		// Revoke the blob URL to free up memory
		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl);
		}
		setPreviewUrl('');
		setIsMaximized(false);
	};

	return (
		<>
			<div role='button' onClick={handleOpen} className={className}>
				{children}
			</div>

			<Dialog open={isOpen} onOpenChange={handleClose}>
				<DialogContent
					hideClose
					onPointerDownOutside={(e) => e.preventDefault()}
					className={cn(
						'flex flex-col p-0 gap-0 transition-all duration-300',
						isMaximized ? 'w-screen h-screen max-w-none rounded-none' : 'max-w-4xl h-[90vh]'
					)}
				>
					<div className='flex items-center justify-between p-4 border-b bg-muted/50 rounded-t-lg'>
						<DialogTitle className='truncate' title={fileName}>
							{fileName}
						</DialogTitle>
						<div className='flex items-center gap-2'>
							<Button variant='ghost' size='icon' className='h-8 w-8' onClick={handleDownload}>
								<Download className='h-4 w-4' />
							</Button>
							{previewUrl && (
								<Button
									variant='ghost'
									size='icon'
									className='h-8 w-8'
									onClick={() => window.open(previewUrl, '_blank')}
								>
									<ExternalLink className='h-4 w-4' />
								</Button>
							)}
							<Button
								variant='ghost'
								size='icon'
								className='h-8 w-8'
								onClick={() => setIsMaximized(!isMaximized)}
							>
								{isMaximized ? <Minimize className='h-4 w-4' /> : <Maximize className='h-4 w-4' />}
							</Button>
							<Button variant='ghost' size='icon' className='h-8 w-8' onClick={handleClose}>
								<X className='h-4 w-4' />
							</Button>
						</div>
					</div>

					<div className='flex-1 flex items-center justify-center overflow-auto bg-muted/20'>
						{isLoading ? (
							<div className='flex flex-col items-center gap-2'>
								<Loader2 className='h-8 w-8 animate-spin text-primary' />
								<p className='text-muted-foreground'>Loading preview...</p>
							</div>
						) : (
							<>
								{isFileImage(fileType) && previewUrl && (
									<img src={previewUrl} alt={fileName} className='max-w-full max-h-full object-contain' />
								)}
								{isFilePdf(fileType) && previewUrl && (
									<iframe src={previewUrl} className='w-full h-full border-0' title={fileName} />
								)}
							</>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
