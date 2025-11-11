
import { IObject } from '@/interfaces/common.interface';
import { notFound } from 'next/navigation';
import { JobCircularDetails } from '../../../../components/app/public/job-circular-details';

export default async function JobDetailsPage({
	params,
}: {
	params: { id: string };
	searchParams: IObject;
}) {
	const aParams = await params;

	if (!aParams.id) {
		notFound();
	}

	return <JobCircularDetails circularId={aParams.id} />;
}
