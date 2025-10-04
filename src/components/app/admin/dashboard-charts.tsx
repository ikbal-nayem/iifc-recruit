'use client';

import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const applicationData = [
  { name: 'Frontend Dev', applications: 12 },
  { name: 'Product Manager', applications: 19 },
  { name: 'Data Scientist', applications: 3 },
  { name: 'Marketing Intern', applications: 5 },
  { name: 'UX Designer', applications: 8 },
];

const jobseekerData = [
  { month: 'Jan', count: 15 },
  { month: 'Feb', count: 20 },
  { month: 'Mar', count: 18 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 30 },
  { month: 'Jun', count: 28 },
];

export function AdminDashboardCharts() {
  return (
     <Card className="col-span-4 glassmorphism">
        <CardHeader>
            <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2 space-y-8">
             <div>
                <h3 className="text-lg font-semibold mb-4 ml-2">Applications per Job</h3>
                <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={applicationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px' }} />
                    <Bar dataKey="applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4 ml-2">Jobseeker Acquisition</h3>
                <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={jobseekerData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px' }}/>
                    <Line type="monotone" dataKey="count" name="New Jobseekers" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}


export function AdminDashboardChartsSkeleton() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent className="space-y-8">
                 <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-[250px] w-full" />
                </div>
                 <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <Skeleton className="h-[250px] w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
