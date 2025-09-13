
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function MasterEducationPage() {

  const educationSections = [
    { title: 'Degree Levels', description: "Manage academic degree levels (e.g., Bachelor's, Master's).", href:'/admin/master-data/education/degree-levels'},
    { title: 'Education Domains', description: "Manage academic domains or fields of study.", href:'/admin/master-data/education/domains'},
    { title: 'Education Institutions', description: "Manage universities, colleges, and other educational institutions.", href:'/admin/master-data/education/institutions'},
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {educationSections.map(section => (
        <Card key={section.title} className="flex flex-col">
            <CardHeader className="flex-grow">
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <div className="p-6 pt-0">
                 <Button asChild variant="link" className="p-0 h-auto group">
                    <Link href={section.href}>
                        Go to {section.title} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>
            </div>
        </Card>
      ))}
    </div>
    );
}

