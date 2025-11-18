'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='flex items-center gap-2'>
					<Globe className='h-4 w-4' />
					<span>{i18n.language === 'en' ? 'English' : 'বাংলা'}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start'>
				<DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeLanguage('bn')}>বাংলা</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
