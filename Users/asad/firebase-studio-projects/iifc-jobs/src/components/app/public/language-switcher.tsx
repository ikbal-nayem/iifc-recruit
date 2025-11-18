'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
	const { i18n } = useTranslation();
	const currentLanguage = i18n.language;

	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'bn', name: 'বাংলা' },
	];

	const changeLanguage = (lang: string) => {
		i18n.changeLanguage(lang);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='sm' className='gap-2'>
					<Globe className='h-4 w-4' />
					<span className='hidden sm:inline'>{currentLanguage === 'bn' ? 'ভাষা' : 'Language'}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{languages.map((lang) => (
					<DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
						<div className='flex items-center justify-between w-full'>
							<span>{lang.name}</span>
							{currentLanguage === lang.code && <Check className='h-4 w-4' />}
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
