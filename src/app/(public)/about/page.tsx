import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, Users, Briefcase } from 'lucide-react';
import Image from 'next/image';

export default function AboutUsPage() {
  const teamMembers = [
    { name: 'Mr. Shahriar Kader Siddiky', role: 'Chairman', avatar: 'https://iifc.gov.bd/images/management/shahriar_kader_siddiky.jpg' },
    { name: 'Mr. Md. Habibur Rahman', role: 'Director', avatar: 'https://iifc.gov.bd/images/management/habibur_rahman.jpg' },
    { name: 'Mr. Abul Kalam Azad', role: 'Director', avatar: 'https://iifc.gov.bd/images/management/abul_kalam_azad.jpg' },
    { name: 'Ms. Nihad Kabir', role: 'Director', avatar: 'https://iifc.gov.bd/images/management/nihad_kabir.jpg' },
    { name: 'Mr. A. K. M. Hamidur Rahman', role: 'Managing Director & CEO', avatar: 'https://iifc.gov.bd/images/management/akm_hamidur_rahman.jpg' },

  ];

  return (
    <div className="bg-background">
      <section className="w-full py-20 md:py-32 hero-gradient">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4">
              About IIFC
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
             Infrastructure Investment Facilitation Company (IIFC) is a government-owned company providing advisory services for private sector investment in infrastructure.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              The mission of IIFC is to facilitate private sector investment in infrastructure in Bangladesh. We provide a wide range of advisory services to both public and private sector clients, from project conceptualization to financial closure.
            </p>
             <p className="text-muted-foreground">
              Our vision is to be the leading facilitator of private sector infrastructure investment in Bangladesh, contributing to the country's economic growth and development. We are committed to providing high-quality, professional, and independent advice to our clients.
            </p>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden">
             <Image src="https://picsum.photos/800/600" alt="Our Office" layout="fill" objectFit="cover" className="transition-transform duration-300 hover:scale-105" data-ai-hint="office building" />
          </div>
        </div>
      </section>

       <section className="bg-muted w-full">
         <div className="container mx-auto px-4 md:px-6 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline font-bold">Why Choose Us?</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">We offer a comprehensive suite of features designed to make recruitment seamless and effective.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center glassmorphism">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                            <Briefcase className="h-8 w-8" />
                        </div>
                        <CardTitle className="font-headline pt-4">Industry-Specific Focus</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        We specialize in the infrastructure and finance sectors, ensuring that job listings are relevant and attract the right talent.
                    </CardContent>
                </Card>
                 <Card className="text-center glassmorphism">
                    <CardHeader>
                         <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                            <Users className="h-8 w-8" />
                        </div>
                        <CardTitle className="font-headline pt-4">Vast Talent Pool</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        Access a diverse and highly skilled pool of candidates ready to take on their next challenge.
                    </CardContent>
                </Card>
                 <Card className="text-center glassmorphism">
                    <CardHeader>
                         <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit">
                            <Building className="h-8 w-8" />
                        </div>
                        <CardTitle className="font-headline pt-4">Top Companies</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        We partner with the leading companies in the industry, offering you access to exclusive job opportunities.
                    </CardContent>
                </Card>
            </div>
        </div>
       </section>

        <section className="container mx-auto px-4 md:px-6 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline font-bold">Meet Our Team</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">The passionate individuals driving our mission forward.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map(member => (
                    <Card key={member.name} className="text-center pt-6 glassmorphism">
                        <CardContent className="flex flex-col items-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="portrait" />
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-bold text-lg">{member.name}</h3>
                            <p className="text-primary">{member.role}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    </div>
  );
}
