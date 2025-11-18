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
import { useEffect } from 'react';

export function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	useEffect(() => {
		// This will set the lang attribute on the html tag whenever the language changes
		document.documentElement.lang = i18n.language;
	}, [i18n.language]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='sm' className='flex items-center gap-2'>
					<Globe className='h-4 w-4' />
					<span>{i18n.language === 'bn' ? 'বাংলা' : 'English'}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => changeLanguage('en')}>English</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeLanguage('bn')}>বাংলা</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
