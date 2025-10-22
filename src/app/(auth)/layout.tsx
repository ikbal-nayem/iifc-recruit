
import Header from '@/components/app/header';
import SidebarNav from '@/components/app/sidebar-nav';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react';
import AuthLayoutProvider from './auth-layout-provider';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<AuthLayoutProvider>
			<Sidebar>
				<SidebarNav />
			</Sidebar>
			<SidebarInset className='flex flex-col bg-gray-200/50'>
				<Header />
				<main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>
					<Suspense
						fallback={
							<div className='space-y-6'>
								<Skeleton className='mx-auto h-4 w-1/2 mb-4' />
								<Skeleton className='mx-auto h-8 w-1/4' />
							</div>
						}
					>
						{children}
					</Suspense>
				</main>
			</SidebarInset>
		</AuthLayoutProvider>
	);
}
