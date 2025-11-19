'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';

const projectsTranslations = {
	en: {
		title: 'Our Projects',
		description: 'Facilitating key infrastructure projects to drive the growth of Bangladesh.',
		learnMore: 'Learn More',
		dhakaExpressway: 'Dhaka Elevated Expressway',
		dhakaDesc: 'A public-private partnership (PPP) project to construct a 46.73 km elevated expressway in Dhaka.',
		payraPort: 'Payra Port Development',
		payraDesc: 'Advisory services for the development of Payra Port, including the main channel dredging.',
		economicZones: 'Economic Zones Development',
		economicDesc: 'Transaction advisory services for the establishment of various economic zones across Bangladesh.',
		laldia: 'Laldia Container Terminal',
		laldiaDesc: 'Transaction advisory services for the Laldia Container Terminal project on a PPP basis.',
		waste: 'Waste to Energy Project',
		wasteDesc: 'Advisory for setting up a waste-to-energy plant in Dhaka to manage solid waste and generate electricity.',
		parking: 'Multi-Storeyed Car Parking',
		parkingDesc: 'Advisory services for constructing multi-storeyed car parking facilities in Dhaka city.',
	},
	bn: {
		title: 'আমাদের প্রকল্প',
		description: 'বাংলাদেশের বৃদ্ধি চালিত করার জন্য মূল অবকাঠামো প্রকল্প সহজতর করা।',
		learnMore: 'আরও জানুন',
		dhakaExpressway: 'ঢাকা এলিভেটেড এক্সপ্রেসওয়ে',
		dhakaDesc: 'ঢাকায় ৪৬.৭৩ কিমি উন্নত এক্সপ্রেসওয়ে নির্মাণের জন্য একটি পাবলিক-প্রাইভেট পার্টনারশিপ (পিপিপি) প্রকল্প।',
		payraPort: 'পায়রা বন্দর উন্নয়ন',
		payraDesc: 'পায়রা বন্দরের উন্নয়নের জন্য পরামর্শ সেবা, মূল চ্যানেল ড্রেজিং সহ।',
		economicZones: 'অর্থনৈতিক অঞ্চল উন্নয়ন',
		economicDesc: 'বাংলাদেশ জুড়ে বিভিন্ন অর্থনৈতিক অঞ্চল প্রতিষ্ঠার জন্য লেনদেন পরামর্শ সেবা।',
		laldia: 'লালদিয়া কন্টেইনার টার্মিনাল',
		laldiaDesc: 'পিপিপি ভিত্তিতে লালদিয়া কন্টেইনার টার্মিনাল প্রকল্পের জন্য লেনদেন পরামর্শ সেবা।',
		waste: 'বর্জ্য থেকে শক্তি প্রকল্প',
		wasteDesc: 'ঢাকায় বর্জ্য থেকে শক্তি উৎপাদন কেন্দ্র স্থাপনের জন্য পরামর্শ, কঠিন বর্জ্য ব্যবস্থাপনা এবং বিদ্যুৎ উৎপাদন।',
		parking: 'বহু-তল গাড়ি পার্কিং',
		parkingDesc: 'ঢাকা শহরে বহু-তল গাড়ি পার্কিং সুবিধা নির্মাণের জন্য পরামর্শ সেবা।',
	}
};

export default function ProjectsPage() {
	const t = useTranslations(projectsTranslations);

	const projects = [
		{
			title: t.dhakaExpressway,
			description: t.dhakaDesc,
			imageUrl: 'https://picsum.photos/seed/dee/600/400',
			hint: 'city highway',
		},
		{
			title: t.payraPort,
			description: t.payraDesc,
			imageUrl: 'https://picsum.photos/seed/payra/600/400',
			hint: 'container ship',
		},
		{
			title: t.economicZones,
			description: t.economicDesc,
			imageUrl: 'https://picsum.photos/seed/sez/600/400',
			hint: 'industrial park',
		},
		{
			title: t.laldia,
			description: t.laldiaDesc,
			imageUrl: 'https://picsum.photos/seed/laldia/600/400',
			hint: 'port crane',
		},
		{
			title: t.waste,
			description: t.wasteDesc,
			imageUrl: 'https://picsum.photos/seed/wte/600/400',
			hint: 'power plant',
		},
		{
			title: t.parking,
			description: t.parkingDesc,
			imageUrl: 'https://picsum.photos/seed/parking/600/400',
			hint: 'parking garage',
		}
	];

	return (
		<div className='bg-background'>
			<section className='w-full py-20 md:py-32 hero-gradient'>
				<div className='container mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4'>
							{t.title}
						</h1>
						<p className='text-lg md:text-xl text-muted-foreground'>
							{t.description}
						</p>
					</div>
				</div>
			</section>

			<section className='container mx-auto px-4 md:px-6 py-16'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{projects.map((project, index) => (
						<Card key={index} className='flex flex-col group glassmorphism card-hover'>
							<CardHeader>
								<div className='relative h-48 w-full overflow-hidden rounded-lg'>
									<Image
										src={project.imageUrl}
										alt={project.title}
										layout='fill'
										objectFit='cover'
										className='transition-transform duration-300 group-hover:scale-105'
										data-ai-hint={project.hint}
									/>
								</div>
								<CardTitle className='font-headline text-xl pt-4 group-hover:text-primary transition-colors'>{project.title}</CardTitle>
							</CardHeader>
							<CardContent className='flex-grow'>
								<CardDescription>{project.description}</CardDescription>
							</CardContent>
							<CardFooter>
								<Button variant='link' asChild className='p-0 h-auto group'>
									<Link href='#'>
										{t.learnMore} <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
