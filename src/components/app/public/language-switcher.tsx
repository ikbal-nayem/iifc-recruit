'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '../../ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const locale = useLocale();

	const changeLocale = (nextLocale: string) => {
		const newPathname = pathname.replace(`/${locale}`, `/${nextLocale}`);
		router.replace(newPathname, { scroll: false });
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
				<DropdownMenuItem onClick={() => changeLocale('en')}>English</DropdownMenuItem>
				<DropdownMenuItem onClick={() => changeLocale('bn')}>বাংলা</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
