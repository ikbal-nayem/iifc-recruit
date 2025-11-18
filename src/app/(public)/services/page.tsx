'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const servicesTranslations = {
	en: {
		title: 'Our Services',
		description: 'IIFC provides a wide range of advisory services to facilitate private sector investment in the infrastructure of Bangladesh.',
		whatWeOffer: 'What We Offer',
		description2: 'As a government-owned advisory body, our primary objective is to accelerate private investment in infrastructure by providing expert, independent advice to both public and private sectors.',
		service1: 'Project-related services',
		service2: 'Policy-related services',
		service3: 'Capacity building services for public sector agencies',
		service4: 'Business advisory services for private sector clients',
		ourServices: 'Our Services',
	},
	bn: {
		title: 'আমাদের সেবা',
		description: 'আইএইফসি বাংলাদেশের অবকাঠামোতে বেসরকারি খাতের বিনিয়োগ সহজতর করার জন্য বিস্তৃত পরামর্শ সেবা প্রদান করে।',
		whatWeOffer: 'আমরা কী অফার করি',
		description2: 'একটি সরকারি-মালিকানাধীন পরামর্শ সংস্থা হিসাবে, আমাদের প্রাথমিক উদ্দেশ্য হল জনসাধারণ এবং বেসরকারি খাতের উভয়ের জন্য বিশেষজ্ঞ, স্বাধীন পরামর্শ প্রদান করে অবকাঠামোতে বেসরকারি বিনিয়োগ ত্বরান্বিত করা।',
		service1: 'প্রকল্প-সম্পর্কিত সেবা',
		service2: 'নীতি-সম্পর্কিত সেবা',
		service3: 'জনসাধারণ খাতের সংস্থাগুলির জন্য ক্ষমতা নির্মাণ সেবা',
		service4: 'বেসরকারি খাতের ক্লায়েন্টদের জন্য ব্যবসায়িক পরামর্শ সেবা',
		ourServices: 'আমাদের সেবা',
	}
};

export default function ServicesPage() {
	const [isClient, setIsClient] = useState(false);
	const [locale, setLocale] = useState<'en' | 'bn'>('en');

	useEffect(() => {
		setIsClient(true);
		const cookieLocale = document.cookie
			.split('; ')
			.find((row) => row.startsWith('NEXT_LOCALE='))
			?.split('=')[1] as 'en' | 'bn' | undefined;

		if (cookieLocale && (cookieLocale === 'en' || cookieLocale === 'bn')) {
			setLocale(cookieLocale);
		}
	}, []);

	const t = servicesTranslations[locale];

	const services = [t.service1, t.service2, t.service3, t.service4];

	if (!isClient) {
		return null;
	}

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
				<div className='grid md:grid-cols-2 gap-12 items-center'>
					<div className='relative h-96 rounded-lg overflow-hidden'>
						<Image src='https://picsum.photos/800/1200' alt={t.ourServices} layout='fill' objectFit='cover' className='transition-transform duration-300 hover:scale-105' data-ai-hint='business meeting' />
					</div>
					<div>
						<h2 className='text-3xl font-headline font-bold mb-6'>{t.whatWeOffer}</h2>
						<p className='text-muted-foreground mb-6'>
							{t.description2}
						</p>
						<div className='space-y-4'>
							{services.map((service, index) => (
								<div key={index} className='flex items-start gap-3'>
									<CheckCircle className='h-6 w-6 text-primary flex-shrink-0 mt-1' />
									<p className='text-foreground'>{service}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
  