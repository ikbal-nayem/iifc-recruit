'use client';

import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const applicationData = [
  { name: 'Frontend Dev', applications: 12 },
  { name: 'Product Manager', applications: 19 },
  { name: 'Data Scientist', applications: 3 },
  { name: 'Marketing Intern', applications: 5 },
  { name: 'UX Designer', applications: 8 },
];

const candidateData = [
  { month: 'Jan', count: 15 },
  { month: 'Feb', count: 20 },
  { month: 'Mar', count: 18 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 30 },
  { month: 'Jun', count: 28 },
];

export function DashboardCharts() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold">Applications per Job</h3>
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
        <h3 className="text-lg font-semibold">Candidate Acquisition</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={candidateData}>
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
              <Line type="monotone" dataKey="count" name="New Candidates" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
