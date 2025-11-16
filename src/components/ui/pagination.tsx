
'use client';

import { IMeta } from '@/interfaces/common.interface';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
	meta: IMeta;
	isLoading?: boolean;
	onPageChange: (page: number) => void;
	noun: string;
}

export function Pagination({ meta, isLoading, onPageChange, noun }: PaginationProps) {
	const currentPage = meta?.page || 0;
	const totalPages = meta?.totalPageCount || 1;
	const from = meta?.totalRecords ? meta?.page * meta?.limit + 1 : 0;
	const to = Math.min((meta?.page + 1) * meta?.limit, meta?.totalRecords || 0) || 0;

	const renderPageNumbers = () => {
		const pageNumbers = [];
		const maxPagesToShow = 5;
		const ellipsis = <span className='px-2 py-1'>...</span>;

		if (totalPages <= maxPagesToShow) {
			for (let i = 0; i < totalPages; i++) {
				pageNumbers.push(
					<Button
						key={i}
						variant={currentPage === i ? 'default' : 'outline'}
						size='sm'
						onClick={() => onPageChange(i)}
						disabled={isLoading}
					>
						{i + 1}
					</Button>
				);
			}
		} else {
			// Always show first page
			pageNumbers.push(
				<Button
					key={0}
					variant={currentPage === 0 ? 'default' : 'outline'}
					size='sm'
					onClick={() => onPageChange(0)}
					disabled={isLoading}
				>
					1
				</Button>
			);

			let startPage = Math.max(1, currentPage - 1);
			let endPage = Math.min(totalPages - 2, currentPage + 1);

			if (currentPage < 3) {
				startPage = 1;
				endPage = 3;
			} else if (currentPage > totalPages - 4) {
				startPage = totalPages - 4;
				endPage = totalPages - 2;
			}
			
			if (startPage > 1) {
				pageNumbers.push(ellipsis);
			}

			for (let i = startPage; i <= endPage; i++) {
				pageNumbers.push(
					<Button
						key={i}
						variant={currentPage === i ? 'default' : 'outline'}
						size='sm'
						onClick={() => onPageChange(i)}
						disabled={isLoading}
					>
						{i + 1}
					</Button>
				);
			}
			
			if (endPage < totalPages - 2) {
				pageNumbers.push(ellipsis);
			}

			// Always show last page
			pageNumbers.push(
				<Button
					key={totalPages - 1}
					variant={currentPage === totalPages - 1 ? 'default' : 'outline'}
					size='sm'
					onClick={() => onPageChange(totalPages - 1)}
					disabled={isLoading}
				>
					{totalPages}
				</Button>
			);
		}

		return pageNumbers;
	};

	return (
        <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between w-full'>
            <p className='text-sm text-muted-foreground'>
                Showing{' '}
                <strong>
                    {from}-{to}
                </strong>{' '}
                of <strong>{meta?.totalRecords}</strong> {noun.toLowerCase()}s
            </p>
            <div className='flex items-center space-x-2'>
                <Button
                    variant='outline'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => onPageChange(meta?.prevPage ?? 0)}
                    disabled={!meta?.prevPage || isLoading}
                >
                    <ChevronLeft className='h-4 w-4' />
                </Button>
                <div className='hidden md:flex items-center gap-1'>{renderPageNumbers()}</div>
                <Button
                    variant='outline'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => onPageChange(meta?.nextPage ?? 0)}
                    disabled={!meta?.nextPage || isLoading}
                >
                    <ChevronRight className='h-4 w-4' />
                </Button>
            </div>
        </div>
	);
};
