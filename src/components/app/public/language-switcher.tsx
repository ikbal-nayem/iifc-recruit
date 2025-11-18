'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	// const { i18n } = useTranslation();
	// const currentLocale = i18n.language;

	const handleLocaleChange = (newLocale: string) => {
		// This will preserve the current path and search params
		const newPath = `/${newLocale}${pathname.startsWith('/en') || pathname.startsWith('/bn') ? pathname.substring(3) : pathname}`;
		router.replace(newPath);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon'>
					<Globe className='h-5 w-5' />
					<span className='sr-only'>Change language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => handleLocaleChange('en')}>English</DropdownMenuItem>
				<DropdownMenuItem onClick={() => handleLocaleChange('bn')}>বাংলা</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
