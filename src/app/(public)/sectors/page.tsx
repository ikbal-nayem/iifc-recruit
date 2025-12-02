'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { Zap, Ship, Plane, Building2, Globe, Wrench, Hospital, GraduationCap } from 'lucide-react';

const sectorsTranslations = {
	en: {
		title: 'Sectors We Serve',
		description:
			'IIFC provides transaction advisory services across a wide range of infrastructure sectors to foster public-private partnerships.',
		power: 'Power Sector',
		port: 'Port Sector',
		transport: 'Transport Sector',
		economicZones: 'Economic Zones',
		tourism: 'Tourism Sector',
		industrial: 'Industrial & Service Sector',
		health: 'Health Sector',
		education: 'Education Sector',
	},
	bn: {
		title: 'আমরা যে সেক্টরগুলিতে সেবা দিই',
		description:
			'আইএইফসি বেসরকারি-জনসাধারণ অংশীদারিত্ব প্রচারের জন্য অবকাঠামোর বিস্তৃত পরিসরে লেনদেন পরামর্শ সেবা প্রদান করে।',
		power: 'শক্তি খাত',
		port: 'বন্দর খাত',
		transport: 'পরিবহন খাত',
		economicZones: 'অর্থনৈতিক অঞ্চল',
		tourism: 'পর্যটন খাত',
		industrial: 'শিল্প ও সেবা খাত',
		health: 'স্বাস্থ্য খাত',
		education: 'শিক্ষা খাত',
	},
};

export default function SectorsPage() {
	const t = useTranslations(sectorsTranslations);

	const sectors = [
		{ title: t.power, icon: Zap },
		{ title: t.port, icon: Ship },
		{ title: t.transport, icon: Plane },
		{ title: t.economicZones, icon: Building2 },
		{ title: t.tourism, icon: Globe },
		{ title: t.industrial, icon: Wrench },
		{ title: t.health, icon: Hospital },
		{ title: t.education, icon: GraduationCap },
	];

	return (
		<div className='bg-background'>
			<section className='w-full py-20 md:py-32 hero-gradient'>
				<div className='container mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4 text-white'>
							{t.title}
						</h1>
						<p className='text-lg md:text-xl text-white'>{t.description}</p>
					</div>
				</div>
			</section>

			<section className='container mx-auto px-4 md:px-6 py-16'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
					{sectors.map((sector, index) => (
						<Card
							key={index}
							className='text-center glassmorphism hover:border-primary transition-colors group card-hover'
						>
							<CardHeader>
								<div className='mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
									<sector.icon className='h-8 w-8' />
								</div>
								<CardTitle className='font-headline pt-4 text-lg'>{sector.title}</CardTitle>
							</CardHeader>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
