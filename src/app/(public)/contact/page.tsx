'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormInput } from '@/components/ui/form-input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MapPin, Phone, Printer } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const contactSchema = z.object({
	name: z.string().min(1, 'Name is required.'),
	email: z.string().email('Please enter a valid email.'),
	subject: z.string().min(1, 'Subject is required.'),
	message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: { name: '', email: '', subject: '', message: '' },
	});

	const handleSubmit = (data: ContactFormValues) => {
		toast.success({
			title: 'Message Sent!',
			description: 'Thank you for contacting us. We will get back to you shortly.',
		});
		form.reset();
	};

	return (
		<>
			<section className='w-full py-20 md:py-24 hero-gradient'>
				<div className='container mx-auto px-4 md:px-6 text-center'>
					<div className='max-w-3xl mx-auto'>
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4'>Get In Touch</h1>
						<p className='text-lg md:text-xl text-muted-foreground'>
							We'd love to hear from you. Whether you have a question about our services, or anything else,
							our team is ready to answer all your questions.
						</p>
					</div>
				</div>
			</section>

			<section className='container mx-auto px-4 md:px-6 py-16'>
				<div className='grid md:grid-cols-2 gap-12'>
					<Card className='glassmorphism'>
						<CardHeader>
							<CardTitle>Send us a Message</CardTitle>
							<CardDescription>Fill out the form and we'll get back to you.</CardDescription>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										<FormInput
											control={form.control}
											name='name'
											label='Name'
											placeholder='Your name'
											required
										/>
										<FormInput
											control={form.control}
											name='email'
											label='Email'
											type='email'
											placeholder='you@example.com'
											required
										/>
									</div>
									<FormInput
										control={form.control}
										name='subject'
										label='Subject'
										placeholder='What is your message about?'
										required
									/>
									<FormField
										control={form.control}
										name='message'
										render={({ field }) => (
											<FormItem>
												<FormLabel required>Message</FormLabel>
												<FormControl>
													<Textarea placeholder='Your message...' className='min-h-[120px]' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type='submit' className='w-full'>
										Send Message
									</Button>
								</form>
							</Form>
						</CardContent>
					</Card>
					<div className='space-y-8'>
						<div>
							<h3 className='text-2xl font-bold font-headline mb-4'>Contact Information</h3>
							<div className='space-y-4 text-muted-foreground'>
								<div className='flex items-start gap-4'>
									<MapPin className='h-6 w-6 text-primary mt-1' />
									<div>
										<h4 className='font-semibold text-foreground'>Our Office</h4>
										<p>Ede-II, 6/B, 147, Mohakhali, Dhaka-1212</p>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<Mail className='h-6 w-6 text-primary mt-1' />
									<div>
										<h4 className='font-semibold text-foreground'>Email Us</h4>
										<a href='mailto:info@iifc.gov.bd' className='hover:text-primary'>
											info@iifc.gov.bd
										</a>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<Phone className='h-6 w-6 text-primary mt-1' />
									<div>
										<h4 className='font-semibold text-foreground'>Telephone</h4>
										<p>
											<a href='tel:+88029889244' className='hover:text-primary'>
												(+8802) 9889244
											</a>
											,{' '}
											<a href='tel:+88029889255' className='hover:text-primary'>
												9889255
											</a>
										</p>
									</div>
								</div>
								<div className='flex items-start gap-4'>
									<Printer className='h-6 w-6 text-primary mt-1' />
									<div>
										<h4 className='font-semibold text-foreground'>Fax</h4>
										<p>(+8802) 9889233</p>
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
