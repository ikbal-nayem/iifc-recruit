'use client';

import * as React from 'react';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';

export function TopLoader() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	React.useEffect(() => {
		NProgress.done();
	}, [pathname, searchParams]);

	React.useEffect(() => {
		NProgress.configure({ showSpinner: true });

		const handleAnchorClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			const anchor = target.closest('a');
			if (anchor) {
				const targetUrl = anchor.href;
				const currentUrl = window.location.href;
				if (targetUrl !== currentUrl) {
					NProgress.start();
				}
			}
		};

		document.addEventListener('click', handleAnchorClick);

		// clean up
		return () => {
			document.removeEventListener('click', handleAnchorClick);
		};
	}, []);

	return null;
}
