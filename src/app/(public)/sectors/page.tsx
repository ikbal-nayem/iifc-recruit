import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Ship, Plane, Building2, Globe, Wrench, Hospital, GraduationCap } from 'lucide-react';

export default function SectorsPage() {
  const sectors = [
    { title: 'Power Sector', icon: Zap },
    { title: 'Port Sector', icon: Ship },
    { title: 'Transport Sector', icon: Plane },
    { title: 'Economic Zones', icon: Building2 },
    { title: 'Tourism Sector', icon: Globe },
    { title: 'Industrial & Service Sector', icon: Wrench },
    { title: 'Health Sector', icon: Hospital },
    { title: 'Education Sector', icon: GraduationCap },
  ];

  return (
    <div className="bg-background">
      <section className="w-full py-20 md:py-32 hero-gradient">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold mb-4">
              Sectors We Serve
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              IIFC provides transaction advisory services across a wide range of infrastructure sectors to foster public-private partnerships.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sectors.map((sector, index) => (
            <Card key={index} className="text-center glassmorphism hover:border-primary transition-colors group card-hover">
              <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <sector.icon className="h-8 w-8" />
                </div>
                <CardTitle className="font-headline pt-4 text-lg">{sector.title}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
