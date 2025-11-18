'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
	const [isClient, setIsClient] = useState(false);
	const [locale, setLocale] = useState<'en' | 'bn'>('en');

	useEffect(() => {
		setIsClient(true);
		// Get locale from cookie
		const cookieLocale = document.cookie
			.split('; ')
			.find((row) => row.startsWith('NEXT_LOCALE='))
			?.split('=')[1] as 'en' | 'bn' | undefined;

		if (cookieLocale && (cookieLocale === 'en' || cookieLocale === 'bn')) {
			setLocale(cookieLocale);
		}
	}, []);

	const changeLanguage = (lng: string) => {
		setLocale(lng as 'en' | 'bn');
		// Update cookie
		document.cookie = `NEXT_LOCALE=${lng}; path=/; max-age=${365 * 24 * 60 * 60}`;
		// Trigger page reload to refresh server component translations
		window.location.reload();
	};

	if (!isClient) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='sm' className='gap-2'>
					<Globe className='h-4 w-4' />
					<span className='capitalize'>{locale === 'bn' ? 'বাংলা' : 'English'}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuRadioGroup value={locale} onValueChange={changeLanguage}>
					<DropdownMenuRadioItem value='en'>English</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value='bn'>বাংলা</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
