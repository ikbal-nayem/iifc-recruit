import { Loader2 } from 'lucide-react';

export function PageLoader() {
	return (
		<div className='flex h-full min-h-[400px] flex-col items-center justify-center gap-4'>
			<Loader2 className='h-10 w-10 animate-spin text-primary' />
			<div className='flex flex-col items-center gap-1 text-center'>
				<p className='font-semibold'>Loading page...</p>
				<p className='text-sm text-muted-foreground'>Please wait a moment.</p>
			</div>
		</div>
	);
}
