import { redirect } from "next/navigation";

export default function AdminJobsPage() {
    // This page is a placeholder. The main functionality is under the /request route.
    // Redirect to the main job request page.
    redirect('/admin/job-management/request');
}
