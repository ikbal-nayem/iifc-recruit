import { COMMON_URL } from '@/constants/common.constant';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';

export default function PublicFooter() {
	return (
		<footer className='bg-primary/5 border-t'>
			<div className='container mx-auto px-4 md:px-6 py-8'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
					<div className='space-y-4'>
						<Link href='/' className='flex items-center gap-2'>
							<Image src={COMMON_URL.SITE_LOGO} alt='IIFC Logo' width={40} height={40} />
							<span className='font-bold text-lg font-headline'>IIFC Jobs</span>
						</Link>
						<p className='text-sm text-muted-foreground'>
							Facilitating private sector investment in the infrastructure of Bangladesh.
						</p>
					</div>

					<div>
						<h4 className='font-semibold mb-3'>Quick Links</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href='/jobs' className='text-muted-foreground hover:text-primary'>
									Job Listings
								</Link>
							</li>
							<li>
								<Link href='/about' className='text-muted-foreground hover:text-primary'>
									About Us
								</Link>
							</li>
							<li>
								<Link href='/contact' className='text-muted-foreground hover:text-primary'>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='font-semibold mb-3'>For Candidates</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href='/signup' className='text-muted-foreground hover:text-primary'>
									Create Account
								</Link>
							</li>
							<li>
								<Link href='/login' className='text-muted-foreground hover:text-primary'>
									Candidate Login
								</Link>
							</li>
							<li>
								<Link href='#' className='text-muted-foreground hover:text-primary'>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className='font-semibold mb-3'>Connect With Us</h4>
						<div className='flex space-x-3'>
							<a
								href='https://facebook.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary'
							>
								<Facebook className='h-5 w-5' />
							</a>
							<a
								href='https://twitter.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary'
							>
								<Twitter className='h-5 w-5' />
							</a>
							<a
								href='https://linkedin.com'
								target='_blank'
								rel='noopener noreferrer'
								className='text-muted-foreground hover:text-primary'
							>
								<Linkedin className='h-5 w-5' />
							</a>
						</div>
						{/* <div className='mt-4'>
							<LanguageSwitcher />
						</div> */}
					</div>
				</div>

				<div className='mt-8 border-t pt-4 text-center text-sm text-muted-foreground'>
					<p>&copy; {new Date().getFullYear()} IIFC. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
