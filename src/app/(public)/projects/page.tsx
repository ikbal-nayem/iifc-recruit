import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsPage() {
  const projects = [
    {
      title: 'Dhaka Elevated Expressway',
      description: 'A public-private partnership (PPP) project to construct a 46.73 km elevated expressway in Dhaka.',
      imageUrl: 'https://picsum.photos/seed/dee/600/400',
      hint: 'city highway',
    },
    {
      title: 'Payra Port Development',
      description: 'Advisory services for the development of Payra Port, including the main channel dredging.',
      imageUrl: 'https://picsum.photos/seed/payra/600/400',
      hint: 'container ship',
    },
    {
      title: 'Economic Zones Development',
      description: 'Transaction advisory services for the establishment of various economic zones across Bangladesh.',
      imageUrl: 'https://picsum.photos/seed/sez/600/400',
      hint: 'industrial park',
    },
    {
      title: 'Laldia Container Terminal',
      description: 'Transaction advisory services for the Laldia Container Terminal project on a PPP basis.',
      imageUrl: 'https://picsum.photos/seed/laldia/600/400',
      hint: 'port crane',
    },
    {
        title: 'Waste to Energy Project',
        description: 'Advisory for setting up a waste-to-energy plant in Dhaka to manage solid waste and generate electricity.',
        imageUrl: 'https://picsum.photos/seed/wte/600/400',
        hint: 'power plant',
    },
    {
        title: 'Multi-Storeyed Car Parking',
        description: 'Advisory services for constructing multi-storeyed car parking facilities in Dhaka city.',
        imageUrl: 'https://picsum.photos/seed/parking/600/400',
        hint: 'parking garage',
    }
  ];

  return (
    <div className="bg-background">
      <section className="w-full py-20 md:py-32 hero-gradient">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4">
              Our Projects
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Facilitating key infrastructure projects to drive the growth of Bangladesh.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card key={index} className="flex flex-col group glassmorphism card-hover">
               <CardHeader>
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={project.hint}
                    />
                </div>
                 <CardTitle className="font-headline text-xl pt-4 group-hover:text-primary transition-colors">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{project.description}</CardDescription>
              </CardContent>
              <CardFooter>
                 <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="#">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
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
