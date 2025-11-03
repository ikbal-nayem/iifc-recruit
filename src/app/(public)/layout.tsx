import PublicFooter from '@/components/app/public/public-footer';
import PublicHeader from '@/components/app/public/public-header';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='bg-muted/30 min-h-screen flex flex-col page-gradient'>
			<PublicHeader />
			<main className='flex-1'>{children}</main>
			<PublicFooter />
		</div>
	);
}
