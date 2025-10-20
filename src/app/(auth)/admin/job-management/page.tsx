import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes.constant";

export default function AdminJobsPage() {
    // This page is a placeholder. The main functionality is under the /request route.
    // Redirect to the main job request page.
    redirect(ROUTES.JOB_REQUESTS);
}
