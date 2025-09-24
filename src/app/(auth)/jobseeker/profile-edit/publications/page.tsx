import { ProfileFormPublications } from '@/components/app/jobseeker/profile-forms/publications';

export type Publication = {
	id?: string;
	title: string;
	publisher: string;
	publicationDate: string;
	url: string;
	userId: number;
};

export default function JobseekerProfilePublicationsPage() {
	return <ProfileFormPublications />;
}
