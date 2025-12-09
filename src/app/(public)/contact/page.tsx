'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const contactSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	email: z.string().email('Please enter a valid email.'),
	subject: z.string().min(1, 'Subject is required.'),
	message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const translations = {
	en: {
		heading: 'Get In Touch',
		subheading:
			"We'd love to hear from you. Whether you have a question about our services, or anything else, our team is ready to answer all your questions.",
		sendMessage: 'Send us a Message',
		fillForm: "Fill out the form and we'll get back to you.",
		name: 'Name',
		namePlaceholder: 'Your name',
		email: 'Email',
		emailPlaceholder: 'you@example.com',
		subject: 'Subject',
		subjectPlaceholder: 'What is your message about?',
		message: 'Message',
		messagePlaceholder: 'Your message...',
		send: 'Send Message',
		contactInfo: 'Contact Information',
		ourOffice: 'Our Office',
		emailUs: 'Email Us',
		telephone: 'Telephone',
		fax: 'Fax',
		successTitle: 'Message Sent!',
		successDesc: 'Thank you for contacting us. We will get back to you shortly.',
	},
	bn: {
		heading: 'আমাদের সাথে যোগাযোগ করুন',
		subheading:
			'আমরা আপনার সাথে শুনতে পছন্দ করব। আমাদের সেবা সম্পর্কে কোনো প্রশ্ন আছে বা অন্য কিছু, আমাদের দল আপনার সমস্ত প্রশ্নের উত্তর দিতে প্রস্তুত।',
		sendMessage: 'আমাদের কাছে বার্তা পাঠান',
		fillForm: 'ফর্মটি পূরণ করুন এবং আমরা আপনার সাথে যোগাযোগ করব।',
		name: 'নাম',
		namePlaceholder: 'আপনার নাম',
		email: 'ইমেল',
		emailPlaceholder: 'you@example.com',
		subject: 'বিষয়',
		subjectPlaceholder: 'আপনার বার্তা কী সম্পর্কে?',
		message: 'বার্তা',
		messagePlaceholder: 'আপনার বার্তা...',
		send: 'বার্তা পাঠান',
		contactInfo: 'যোগাযোগ তথ্য',
		ourOffice: 'আমাদের অফিস',
		emailUs: 'আমাদের কাছে ইমেল করুন',
		telephone: 'টেলিফোন',
		fax: 'ফ্যাক্স',
		successTitle: 'বার্তা পাঠানো হয়েছে!',
		successDesc: 'আমাদের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।',
	},
};

export default function ContactPage() {
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

	const t = translations[locale];
	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: { name: '', email: '', subject: '', message: '' },
	});

	const handleSubmit = (data: ContactFormValues) => {
		toast.success({
			title: t.successTitle,
			description: t.successDesc,
		});
		form.reset();
	};

	if (!isClient) return null;

	return (
		<>
			<section className='w-full py-20 md:py-24 hero-gradient'>
				<div className='container mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4 text-white'>
							{t.heading}
						</h1>
						<p className='text-lg md:text-xl text-white'>{t.subheading}</p>
					</div>
				</div>
			</section>

			<section className='container mx-auto px-4 md:px-6 py-16'>
				<div className='grid md:grid-cols-2 gap-12'>
					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>{t.sendMessage}</CardTitle>
							<CardDescription>{t.fillForm}</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<FormInput
											control={form.control}
											name='name'
											label={t.name}
											placeholder={t.namePlaceholder}
											required
										/>
										<FormInput
											control={form.control}
											name='email'
											label={t.email}
											type='email'
											placeholder={t.emailPlaceholder}
											required
										/>
									</div>
									<FormInput
										control={form.control}
										name='subject'
										label={t.subject}
										placeholder={t.subjectPlaceholder}
										required
									/>
									<FormField
										control={form.control}
										name='message'
										render={({ field }) => (
											<FormItem>
												<FormLabel required>{t.message}</FormLabel>
												<FormControl>
													<Textarea placeholder={t.messagePlaceholder} className='min-h-[120px]' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type='submit' className='w-full'>
										{t.send}
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
					<div className='space-y-4'>
						<div>
							<h3 className='text-2xl font-bold font-headline mb-4'>{t.contactInfo}</h3>
							<div className='space-y-4 text-muted-foreground'>
								<div className='flex items-start gap-4'>
									<MapPin className='h-6 w-6 text-primary mt-1' />
									<div>
										<h4 className='font-semibold text-foreground'>{t.ourOffice}</h4>
										<p>
											JDPC Bhaban <sup>(3rd floor)</sup>, 145 Monipuripara, Tejgaon, Dhaka-1215, Bangladesh.
										</p>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<Mail className='h-6 w-6 text-primary mt-1' />
									<div>
										<h4 className='font-semibold text-foreground'>{t.emailUs}</h4>
										<a href='mailto:info@iifc.gov.bd' className='hover:text-primary'>
											info@iifc.gov.bd
										</a>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<Phone className='h-6 w-6 text-primary mt-1' />
									<div>
										<h4 className='font-semibold text-foreground'>{t.telephone}</h4>
										<p>
											<a href='tel:+8802223314093' className='hover:text-primary'>
												(+8802) 223314093
											</a>
											,{' '}
											<a href='tel:+8802223314096' className='hover:text-primary'>
												223314096
											</a>
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
