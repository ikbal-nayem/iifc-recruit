
import { redirect } from 'next/navigation';

export default function ApplicationsRedirectPage() {
    // This page is a placeholder to make the sidebar link work.
    // In a real app, this might show all applications across all jobs.
    // For now, we redirect to the first job's applicants page as a demo.
    redirect('/admin/job-management/j1/applicants');
}
