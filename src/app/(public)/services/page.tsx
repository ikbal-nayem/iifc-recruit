import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function ServicesPage() {
    const services = [
      'Project-related services',
      'Policy-related services',
      'Capacity building services for public sector agencies',
      'Business advisory services for private sector clients'
    ];
  
    return (
      <div className="bg-background">
        <section className="w-full py-20 md:py-32 hero-gradient">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4">
                Our Services
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                IIFC provides a wide range of advisory services to facilitate private sector investment in the infrastructure of Bangladesh.
              </p>
            </div>
          </div>
        </section>
  
        <section className="container mx-auto px-4 md:px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="relative h-96 rounded-lg overflow-hidden">
               <Image src="https://picsum.photos/800/1200" alt="Our Services" layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105" data-ai-hint="business meeting" />
            </div>
            <div>
              <h2 className="text-3xl font-headline font-bold mb-6">What We Offer</h2>
              <p className="text-muted-foreground mb-6">
                As a government-owned advisory body, our primary objective is to accelerate private investment in infrastructure by providing expert, independent advice to both public and private sectors.
              </p>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <p className="text-foreground">{service}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  