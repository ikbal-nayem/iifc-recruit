import { OrganizationUserManagement } from '@/components/app/admin/client-organizations/organization-user-management';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IClientOrganization, IRole } from '@/interfaces/master-data.interface';
import { MasterDataService } from '@/services/api/master-data.service';
import { RoleService } from '@/services/api/role.service';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { notFound } from 'next/navigation';

async function getData(id: string) {
	try {
		const [orgRes, rolesRes] = await Promise.all([
			MasterDataService.clientOrganization.getDetails(id),
			RoleService.getList(),
		]);

		return {
			organization: orgRes.body,
			roles: rolesRes.body,
		};
	} catch (error) {
		console.error('Failed to load organization details:', error);
		notFound();
	}
}

export default async function ClientOrganizationDetailsPage({ params }: { params: { id: string } }) {
	const { organization, roles } = await getData(params.id);

	if (!organization) {
		notFound();
	}

	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>{organization.nameEn}</h1>
					<p className='text-muted-foreground'>{organization.nameBn}</p>
					<div className='flex gap-2 mt-2'>
						{organization.isClient && <Badge>Client</Badge>}
						{organization.isExaminer && <Badge>Examiner</Badge>}
					</div>
				</div>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Organization Details</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm'>
						{organization.address && (
							<div className='flex items-start gap-3'>
								<MapPin className='h-4 w-4 mt-0.5 text-muted-foreground' />
								<div>
									<p className='font-medium'>Address</p>
									<p className='text-muted-foreground'>{organization.address}</p>
								</div>
							</div>
						)}
						{organization.contactPersonName && (
							<div className='flex items-start gap-3'>
								<Phone className='h-4 w-4 mt-0.5 text-muted-foreground' />
								<div>
									<p className='font-medium'>Contact Person</p>
									<p className='text-muted-foreground'>
										{organization.contactPersonName}{' '}
										{organization?.contactNumber && <>({organization.contactNumber})</>}
									</p>
								</div>
							</div>
						)}
						{organization.email && (
							<div className='flex items-start gap-3'>
								<Mail className='h-4 w-4 mt-0.5 text-muted-foreground' />
								<div>
									<p className='font-medium'>Email</p>
									<p className='text-muted-foreground'>{organization.email}</p>
								</div>
							</div>
						)}
						{organization.website && (
							<div className='flex items-start gap-3'>
								<Globe className='h-4 w-4 mt-0.5 text-muted-foreground' />
								<div>
									<p className='font-medium'>Website</p>
									<a
										href={organization.website}
										target='_blank'
										rel='noopener noreferrer'
										className='text-primary hover:underline'
									>
										{organization.website}
									</a>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<OrganizationUserManagement organizationId={params.id as string} roles={roles} />
		</div>
	);
}
