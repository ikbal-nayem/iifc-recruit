'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { Briefcase, Building, Users } from 'lucide-react';
import Image from 'next/image';

const aboutTranslations = {
	en: {
		title: 'About IIFC',
		intro:
			'Infrastructure Investment Facilitation Company (IIFC) is a government-owned company providing advisory services for private sector investment in infrastructure.',
		missionTitle: 'Our Mission',
		missionText1:
			'The mission of IIFC is to facilitate private sector investment in infrastructure in Bangladesh. We provide a wide range of advisory services to both public and private sector clients, from project conceptualization to financial closure.',
		missionText2:
			"Our vision is to be the leading facilitator of private sector infrastructure investment in Bangladesh, contributing to the country's economic growth and development. We are committed to providing high-quality, professional, and independent advice to our clients.",
		whyChooseUs: 'Why Choose Us?',
		whyDesc:
			'We offer a comprehensive suite of features designed to make recruitment seamless and effective.',
		industryFocus: 'Industry-Specific Focus',
		industryDesc:
			'We specialize in the infrastructure and finance sectors, ensuring that job listings are relevant and attract the right talent.',
		talentPool: 'Vast Talent Pool',
		talentDesc:
			'Access a diverse and highly skilled pool of candidates ready to take on their next challenge.',
		topCompanies: 'Top Companies',
		companiesDesc:
			'We partner with the leading companies in the industry, offering you access to exclusive job opportunities.',
		team: 'Meet Our Team',
		teamDesc: 'The passionate individuals driving our mission forward.',
		ourOffice: 'Our Office',
	},
	bn: {
		title: 'আইএইফসি সম্পর্কে',
		intro:
			'অবকাঠামো বিনিয়োগ সুবিধা কোম্পানি (আইএইফসি) একটি সরকারি-মালিকানাধীন কোম্পানি যা অবকাঠামোতে বেসরকারি খাতের বিনিয়োগের জন্য পরামর্শ সেবা প্রদান করে।',
		missionTitle: 'আমাদের লক্ষ্য',
		missionText1:
			'আইএইফসির লক্ষ্য বাংলাদেশে অবকাঠামোতে বেসরকারি খাতের বিনিয়োগ সহজতর করা। আমরা প্রকল্পের ধারণা থেকে আর্থিক সমাপ্তি পর্যন্ত জনসাধারণ এবং বেসরকারি খাতের ক্লায়েন্টদের জন্য বিস্তৃত পরামর্শ সেবা প্রদান করি।',
		missionText2:
			'আমাদের দৃষ্টিভঙ্গি হল বাংলাদেশে বেসরকারি খাতের অবকাঠামো বিনিয়োগের প্রধান সুবিধাকারী হওয়া, যা দেশের অর্থনৈতিক বৃদ্ধি এবং উন্নয়নে অবদান রাখে। আমরা আমাদের ক্লায়েন্টদের উচ্চ মানের, পেশাদার এবং স্বাধীন পরামর্শ প্রদান করতে প্রতিশ্রুতিবদ্ধ।',
		whyChooseUs: 'কেন আমাদের বেছে নিবেন?',
		whyDesc:
			'আমরা নিয়োগকে সহজ এবং কার্যকর করার জন্য ডিজাইন করা বৈশিষ্ট্যগুলির একটি ব্যাপক সমন্বয় অফার করি।',
		industryFocus: 'শিল্প-নির্দিষ্ট ফোকাস',
		industryDesc:
			'আমরা অবকাঠামো এবং অর্থ খাতে বিশেষজ্ঞ, যাতে চাকরির তালিকা প্রাসঙ্গিক এবং সঠিক প্রতিভা আকৃষ্ট করে।',
		talentPool: 'বৃহৎ প্রতিভার পুল',
		talentDesc:
			'তাদের পরবর্তী চ্যালেঞ্জ নিতে প্রস্তুত বৈচিত্র্যময় এবং অত্যন্ত দক্ষ প্রার্থীদের একটি পুল অ্যাক্সেস করুন।',
		topCompanies: 'শীর্ষ কোম্পানি',
		companiesDesc:
			'আমরা শিল্পের শীর্ষস্থানীয় কোম্পানিগুলির সাথে অংশীদারিত্ব করি, আপনাকে একচেটিয়া চাকরির সুযোগে অ্যাক্সেস প্রদান করি।',
		team: 'আমাদের দলের সাথে দেখা করুন',
		teamDesc: 'আমাদের মিশনকে এগিয়ে নিয়ে যাওয়ার জন্য নিবেদিত ব্যক্তিরা।',
		ourOffice: 'আমাদের অফিস',
	},
};

export default function AboutUsPage() {
	const t = useTranslations(aboutTranslations);

	const teamMembers = [
		{
			name: 'Mr. Shahriar Kader Siddiky',
			role: 'Chairman',
			avatar: 'https://iifc.gov.bd/images/management/shahriar_kader_siddiky.jpg',
		},
		{
			name: 'Mr. Md. Habibur Rahman',
			role: 'Director',
			avatar: 'https://iifc.gov.bd/images/management/habibur_rahman.jpg',
		},
		{
			name: 'Mr. Abul Kalam Azad',
			role: 'Director',
			avatar: 'https://iifc.gov.bd/images/management/abul_kalam_azad.jpg',
		},
		{
			name: 'Ms. Nihad Kabir',
			role: 'Director',
			avatar: 'https://iifc.gov.bd/images/management/nihad_kabir.jpg',
		},
		{
			name: 'Mr. A. K. M. Hamidur Rahman',
			role: 'Managing Director & CEO',
			avatar: 'https://iifc.gov.bd/images/management/akm_hamidur_rahman.jpg',
		},
	];

	return (
		<div className='bg-background'>
			<section className='w-full py-20 md:py-32 hero-gradient'>
				<div className='container mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4'>{t.title}</h1>
						<p className='text-lg md:text-xl text-muted-foreground'>{t.intro}</p>
					</div>
				</div>
			</section>

			<section className='container mx-auto px-4 md:px-6 py-16'>
				<div className='grid md:grid-cols-2 gap-12 items-center'>
					<div>
						<h2 className='text-3xl font-headline font-bold mb-4'>{t.missionTitle}</h2>
						<p className='text-muted-foreground mb-4'>{t.missionText1}</p>
						<p className='text-muted-foreground'>{t.missionText2}</p>
					</div>
					<div className='relative h-80 rounded-lg overflow-hidden'>
						<Image
							src='https://picsum.photos/800/600'
							alt={t.ourOffice}
							layout='fill'
							objectFit='cover'
							className='transition-transform duration-300 hover:scale-105'
							data-ai-hint='office building'
						/>
					</div>
				</div>
			</section>

			<section className='bg-muted w-full'>
				<div className='container mx-auto px-4 md:px-6 py-16'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl font-headline font-bold'>{t.whyChooseUs}</h2>
						<p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>{t.whyDesc}</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<Card className='text-center glassmorphism card-hover'>
							<CardHeader>
								<div className='mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit'>
									<Briefcase className='h-8 w-8' />
								</div>
								<CardTitle className='font-headline pt-4'>{t.industryFocus}</CardTitle>
							</CardHeader>
							<CardContent className='text-muted-foreground'>{t.industryDesc}</CardContent>
						</Card>
						<Card className='text-center glassmorphism card-hover'>
							<CardHeader>
								<div className='mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit'>
									<Users className='h-8 w-8' />
								</div>
								<CardTitle className='font-headline pt-4'>{t.talentPool}</CardTitle>
							</CardHeader>
							<CardContent className='text-muted-foreground'>{t.talentDesc}</CardContent>
						</Card>
						<Card className='text-center glassmorphism card-hover'>
							<CardHeader>
								<div className='mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit'>
									<Building className='h-8 w-8' />
								</div>
								<CardTitle className='font-headline pt-4'>{t.topCompanies}</CardTitle>
							</CardHeader>
							<CardContent className='text-muted-foreground'>{t.companiesDesc}</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section className='container mx-auto px-4 md:px-6 py-16'>
				<div className='text-center mb-12'>
					<h2 className='text-3xl font-headline font-bold'>{t.team}</h2>
					<p className='text-muted-foreground mt-2 max-w-2xl mx-auto'>{t.teamDesc}</p>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
					{teamMembers.map((member) => (
						<Card key={member.name} className='text-center pt-6 glassmorphism card-hover'>
							<CardContent className='flex flex-col items-center'>
								<Avatar className='h-24 w-24 mb-4'>
									<AvatarImage src={member.avatar} alt={member.name} data-ai-hint='portrait' />
									<AvatarFallback>
										{member.name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<div className='w-full'>
									<h3 className='font-bold text-lg'>{member.name}</h3>
									<p className='text-primary'>{member.role}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</section>
		</div>
	);
}
