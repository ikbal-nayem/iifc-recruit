'use client';

import { jobseekerNavLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const profileTabs = (jobseekerNavLinks.find((item) => item.label === 'Edit Profile')?.submenu || []).map(
	({ isActive, ...tab }) => tab
);

export function ProfileTabs() {
	const pathname = usePathname();

	return profileTabs.map((tab) => {
		const isActive = pathname === tab.href;

		return (
			<Link
				key={tab.href}
				href={tab.href}
				className={cn(
					'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
					isActive ? 'bg-primary text-primary-foreground shadow' : 'hover:bg-accent hover:text-accent-foreground'
				)}
			>
				{tab.label}
			</Link>
		);
	});
}
