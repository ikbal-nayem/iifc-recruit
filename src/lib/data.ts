import type { Candidate, Job, Application, Activity } from './types';
import { subDays, format } from 'date-fns';

export const candidates: Candidate[] = [
  {
    id: 'c1',
    personalInfo: {
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      phone: '123-456-7890',
      location: 'San Francisco, CA',
      avatar: 'https://picsum.photos/seed/alice/100/100',
      headline: 'Senior Frontend Developer with 8+ years of experience',
    },
    academicInfo: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'Stanford University',
        graduationYear: 2016,
      },
    ],
    professionalInfo: [
      {
        company: 'TechCorp',
        role: 'Senior Frontend Developer',
        duration: '2019 - Present',
        responsibilities: ['Led development of a new design system', 'Mentored junior developers'],
      },
       {
        company: 'Innovate LLC',
        role: 'Frontend Developer',
        duration: '2016 - 2019',
        responsibilities: ['Built and maintained client-facing web applications', 'Collaborated with UI/UX designers'],
      },
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Node.js', 'Figma'],
    status: 'Active',
  },
  {
    id: 'c2',
    personalInfo: {
      name: 'Bob Smith',
      email: 'bob.s@example.com',
      phone: '234-567-8901',
      location: 'New York, NY',
      avatar: 'https://picsum.photos/seed/bob/100/100',
      headline: 'Product Manager driving innovation and growth',
    },
    academicInfo: [
      {
        degree: 'MBA',
        institution: 'Columbia Business School',
        graduationYear: 2018,
      },
    ],
    professionalInfo: [
      {
        company: 'Solutions Inc.',
        role: 'Product Manager',
        duration: '2018 - Present',
        responsibilities: ['Defined product roadmap for B2B SaaS platform', 'Conducted market research and user interviews'],
      },
    ],
    skills: ['Product Management', 'Agile', 'JIRA', 'Market Research', 'Roadmap Planning'],
    status: 'Passive',
  },
  {
    id: 'c3',
    personalInfo: {
      name: 'Charlie Brown',
      email: 'charlie.b@example.com',
      phone: '345-678-9012',
      location: 'Austin, TX',
      avatar: 'https://picsum.photos/seed/charlie/100/100',
      headline: 'Data Scientist passionate about machine learning',
    },
    academicInfo: [
       {
        degree: 'M.S. in Data Science',
        institution: 'University of Texas at Austin',
        graduationYear: 2020,
      },
    ],
    professionalInfo: [
      {
        company: 'DataWiz',
        role: 'Data Scientist',
        duration: '2020 - Present',
        responsibilities: ['Developed predictive models for customer churn', 'Built data visualization dashboards in Tableau'],
      },
    ],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau', 'Machine Learning'],
    status: 'Active',
  },
    {
    id: 'c4',
    personalInfo: {
      name: 'Diana Prince',
      email: 'diana.p@example.com',
      phone: '456-789-0123',
      location: 'Chicago, IL',
      avatar: 'https://picsum.photos/seed/diana/100/100',
      headline: 'UX/UI Designer creating intuitive user experiences',
    },
    academicInfo: [
      {
        degree: 'B.A. in Graphic Design',
        institution: 'Rhode Island School of Design',
        graduationYear: 2019,
      },
    ],
    professionalInfo: [
       {
        company: 'Creative Minds',
        role: 'UX/UI Designer',
        duration: '2019 - Present',
        responsibilities: ['Designed user flows and wireframes', 'Conducted usability testing sessions'],
      },
    ],
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
    status: 'Hired',
  },
];

export const jobs: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salaryRange: '$140,000 - $180,000',
    description: 'We are seeking an experienced Frontend Developer to join our team and help build the next generation of our platform.',
    responsibilities: [
      'Develop and maintain user-facing features using React and TypeScript.',
      'Build reusable components and front-end libraries for future use.',
      'Translate designs and wireframes into high-quality code.',
      'Optimize components for maximum performance across a vast array of web-capable devices and browsers.',
    ],
    requirements: [
      '5+ years of experience in frontend development.',
      'Proficient in React, TypeScript, and modern JavaScript (ES6+).',
      'Experience with state management libraries like Redux or Zustand.',
      'Familiarity with GraphQL APIs.',
    ],
    status: 'Open',
    postedDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
  },
  {
    id: 'j2',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    salaryRange: '$150,000 - $190,000',
    description: 'We are looking for a talented Product Manager to own the roadmap and vision for our core product offering.',
    responsibilities: [
        'Define and prioritize product features based on market analysis and customer feedback.',
        'Work closely with engineering, design, and marketing teams to bring products to market.',
        'Develop and maintain a product roadmap.',
        'Analyze product performance and user data to inform decisions.'
    ],
    requirements: [
        '4+ years of product management experience, preferably in a B2B SaaS environment.',
        'Strong understanding of agile development methodologies.',
        'Excellent communication and leadership skills.',
        'Proven ability to influence cross-functional teams without formal authority.'
    ],
    status: 'Open',
    postedDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
  },
  {
    id: 'j3',
    title: 'Data Scientist',
    department: 'Data Science',
    location: 'Austin, TX',
    type: 'Full-time',
    salaryRange: '$130,000 - $170,000',
    description: 'Join our data team to build machine learning models that drive business decisions and improve user experience.',
    responsibilities: [
        'Design, build, and deploy machine learning models.',
        'Perform data analysis and generate insights to support product and business teams.',
        'Develop data pipelines and infrastructure.',
        'Communicate findings to both technical and non-technical stakeholders.'
    ],
    requirements: [
        '3+ years of experience in a data science role.',
        'Proficiency in Python and SQL.',
        'Hands-on experience with machine learning frameworks like Scikit-learn, TensorFlow, or PyTorch.',
        'Experience with data visualization tools like Tableau or PowerBI.'
    ],
    status: 'Closed',
    postedDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
  },
    {
    id: 'j4',
    title: 'Marketing Intern',
    department: 'Marketing',
    location: 'Remote',
    type: 'Internship',
    salaryRange: '$25/hour',
    description: 'An exciting opportunity for a student or recent graduate to gain hands-on marketing experience.',
    responsibilities: [
        'Assist with social media content creation and scheduling.',
        'Help manage email marketing campaigns.',
        'Conduct market research on competitors.',
        'Support the marketing team with various administrative tasks.'
    ],
    requirements: [
        'Currently pursuing or recently completed a degree in Marketing, Business, or a related field.',
        'Strong written and verbal communication skills.',
        'Familiarity with social media platforms.',
        'Eagerness to learn and a can-do attitude.'
    ],
    status: 'Open',
    postedDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
  },
];

export const applications: Application[] = [
    { id: 'app1', jobId: 'j1', candidateId: 'c1', status: 'Interview', applicationDate: format(subDays(new Date(), 1), 'yyyy-MM-dd') },
    { id: 'app2', jobId: 'j2', candidateId: 'c2', status: 'Applied', applicationDate: format(subDays(new Date(), 8), 'yyyy-MM-dd') },
    { id: 'app3', jobId: 'j3', candidateId: 'c3', status: 'Hired', applicationDate: format(subDays(new Date(), 25), 'yyyy-MM-dd') },
    { id: 'app4', jobId: 'j1', candidateId: 'c3', status: 'Screening', applicationDate: format(subDays(new Date(), 1), 'yyyy-MM-dd') },
];


export const activities: Activity[] = [
  {
    id: 'act1',
    user: { name: 'Admin User', avatar: 'https://picsum.photos/seed/admin/100/100' },
    action: 'posted a new job:',
    target: 'Marketing Intern',
    timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm'),
  },
  {
    id: 'act2',
    user: { name: 'Alice Johnson', avatar: 'https://picsum.photos/seed/alice/100/100' },
    action: 'applied for:',
    target: 'Senior Frontend Developer',
    timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm'),
  },
  {
    id: 'act3',
    user: { name: 'Admin User', avatar: 'https://picsum.photos/seed/admin/100/100' },
    action: 'shortlisted',
    target: 'Charlie Brown for Senior Frontend Developer',
    timestamp: format(new Date(), 'yyyy-MM-dd HH:mm'),
  },
    {
    id: 'act4',
    user: { name: 'Admin User', avatar: 'https://picsum.photos/seed/admin/100/100' },
    action: 'changed status of',
    target: 'Data Scientist to Closed',
    timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm'),
  }
];
