
export type UserRole = 'candidate' | 'admin';

export type Address = {
    line1: string;
    upazila: string;
    district: string;
    division: string;
};

export type PersonalInfo = {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  avatar: string;
  headline: string;
};

export type AcademicInfo = {
  degree: string;
  institution: string;
  graduationYear: number;
  certificateUrls?: string[];
};

export type ProfessionalInfo = {
  company: string;
  role: string;
  fromDate: string;
  toDate?: string;
  isPresent: boolean;
  responsibilities: string[];
  documentUrls?: string[];
};

export type Certification = {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    proofUrl?: string;
};

export type Language = {
    name: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native';
};

export type Publication = {
    title: string;
    publisher: string;
    publicationDate: string;
    url: string;
};

export type Award = {
    name: string;
    awardingBody: string;
    dateReceived: string;
};


export type Candidate = {
  id: string;
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo[];
  professionalInfo: ProfessionalInfo[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  publications: Publication[];
  awards: Award[];
  resumeUrl?: string;
  status: 'Active' | 'Passive' | 'Hired';
};

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salaryRange: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: 'Open' | 'Closed' | 'Archived';
  postedDate: string;
  applicationDeadline: string;
};

export type Application = {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offered' | 'Rejected' | 'Hired' | 'Shortlisted';
  applicationDate: string;
};

export type Activity = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  timestamp: string;
};
