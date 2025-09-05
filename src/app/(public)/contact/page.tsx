'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We will get back to you shortly.",
    });
  };

  return (
    <>
       <section className="w-full py-20 md:py-24 hero-gradient">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              We'd love to hear from you. Whether you have a question about our services, or anything else, our team is ready to answer all your questions.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form and we'll get back to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required/>
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is your message about?" required/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" required/>
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold font-headline mb-4">Contact Information</h3>
              <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-primary mt-1"/>
                      <div>
                          <h4 className="font-semibold text-foreground">Our Office</h4>
                          <p>Ede-II, 6/B, 147, Mohakhali, Dhaka-1212</p>
                      </div>
                  </div>
                   <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-primary mt-1"/>
                      <div>
                          <h4 className="font-semibold text-foreground">Email Us</h4>
                          <a href="mailto:info@iifc.gov.bd" className="hover:text-primary">info@iifc.gov.bd</a>
                      </div>
                  </div>
                   <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-primary mt-1"/>
                      <div>
                          <h4 className="font-semibold text-foreground">Call Us</h4>
                          <a href="tel:+88029889244" className="hover:text-primary">(+8802) 9889244</a>
                      </div>
                  </div>
              </div>
            </div>
             <div>
                <h3 className="text-2xl font-bold font-headline mb-4">Our Location</h3>
                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                    <Image src="https://picsum.photos/seed/map/800/600" alt="Map" layout="fill" objectFit="cover" data-ai-hint="city map" />
                </div>
             </div>
          </div>
        </div>
      </section>
    </>
  );
}
