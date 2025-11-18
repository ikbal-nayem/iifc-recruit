'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='sm' className='gap-2'>
					<Globe className='h-4 w-4' />
					<span className='capitalize'>{i18n.language === 'bn' ? 'বাংলা' : 'English'}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeLanguage('bn')}>বাংলা</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
