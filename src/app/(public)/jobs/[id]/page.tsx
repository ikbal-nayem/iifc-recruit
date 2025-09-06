import { jobs as allJobs } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, ArrowRight, Building, DollarSign, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { JobDetailClient } from '@/components/app/candidate/job-detail-client';

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = allJobs.find((j) => j.id === params.id);

  if (!job) {
    notFound();
  }

  const similarJobs = allJobs.filter(
    (j) => j.department === job.department && j.id !== job.id && j.status === 'Open'
  ).slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glassmorphism">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <CardTitle className="font-headline text-3xl">{job.title}</CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
                            <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {job.department}</span>
                            <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {job.location}</span>
                            <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {job.type}</span>
                             <span className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> {job.salaryRange}</span>
                        </CardDescription>
                    </div>
                     <div className="flex-shrink-0">
                        <JobDetailClient jobTitle={job.title} />
                    </div>
                </div>
              </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex items-center gap-2">
                <span className="font-semibold">Job Type:</span>
                <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>{job.type}</Badge>
               </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Job Description</h3>
                <p className="text-muted-foreground">{job.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Responsibilities</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {job.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {job.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <h3 className="text-xl font-bold font-headline">Similar Jobs</h3>
            {similarJobs.length > 0 ? (
              similarJobs.map((similarJob) => (
                <Card key={similarJob.id} className="group hover:border-primary transition-all glassmorphism">
                   <CardHeader>
                     <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">{similarJob.title}</CardTitle>
                     <CardDescription className="flex items-center gap-2 pt-1">
                        <Building className="h-4 w-4" /> {similarJob.department}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {similarJob.location}</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {similarJob.type}</span>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/jobs/${similarJob.id}`}>
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No similar jobs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
