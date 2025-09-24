'use client';

import { NavLink } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ProfileTabs({ profileTabs }: { profileTabs: Array<NavLink> }) {
	const pathname = usePathname();

	return profileTabs.map((tab) => {
		const isActive = tab.isActive ? tab.isActive(pathname) : pathname === tab.href;
		return (
			<Link
				key={tab.href}
				href={tab.href}
				className={cn(
					'py-3 px-1 text-sm font-medium transition-colors relative',
					isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
				)}
			>
				{tab.label}
				{isActive && <div className='absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full' />}
			</Link>
		);
	});
}
