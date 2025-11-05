
import { OrganizationUserManagement } from '@/components/app/admin/client-organizations/organization-user-management';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/api/auth.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { Building, Globe, Mail, MapPin, Phone, UserCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

const payload = { body: { system: false } };

async function getData(id: string) {
	try {
		const [orgRes, rolesRes] = await Promise.all([
			MasterDataService.clientOrganization.getDetails(id),
			AuthService.getRoleList(payload),
		]);

		return {
			organization: orgRes.body,
			roles: rolesRes.body?.filter((role) =>
				orgRes.body?.isClient
					? role.code?.startsWith('CLIENT_')
					: orgRes.body?.isExaminer
					? role.code?.startsWith('EXAMINER_')
					: false
			),
		};
	} catch (error) {
		console.error('Failed to load organization details:', error);
		notFound();
	}
}

export default async function ClientOrganizationDetailsPage({ params }: { params: { id: string } }) {
	const aParams = await params;
	const { organization, roles } = await getData(aParams.id);

	if (!organization) {
		notFound();
	}

	return (
		<div className='space-y-8'>
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>{organization.nameEn}</h1>
					<p className='text-muted-foreground'>{organization.nameBn}</p>
				</div>
			</div>

			<Card className='glassmorphism'>
				<CardHeader>
					<CardTitle>Organization Details</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm'>
						<div className='flex items-start gap-3'>
							<UserCheck className='h-4 w-4 mt-1 text-muted-foreground' />
							<div>
								<p className='font-medium'>Roles</p>
								<div className='flex gap-2 mt-1'>
									{organization.isClient && <Badge variant='success'>Client</Badge>}
									{organization.isExaminer && <Badge variant='info'>Examiner</Badge>}
								</div>
							</div>
						</div>
						{organization.organizationType && (
							<div className='flex items-start gap-3'>
								<Building className='h-4 w-4 mt-1 text-muted-foreground' />
								<div>
									<p className='font-medium'>Organization Type</p>
									<p className='text-muted-foreground'>{organization.organizationType.nameEn}</p>
								</div>
							</div>
						)}
						{organization.contactPersonName && (
							<div className='flex items-start gap-3'>
								<Phone className='h-4 w-4 mt-1 text-muted-foreground' />
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
								<Mail className='h-4 w-4 mt-1 text-muted-foreground' />
								<div>
									<p className='font-medium'>Email</p>
									<p className='text-muted-foreground'>{organization.email}</p>
								</div>
							</div>
						)}
						{organization.website && (
							<div className='flex items-start gap-3'>
								<Globe className='h-4 w-4 mt-1 text-muted-foreground' />
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
						{organization.address && (
							<div className='flex items-start gap-3 md:col-span-2'>
								<MapPin className='h-4 w-4 mt-1 text-muted-foreground' />
								<div>
									<p className='font-medium'>Address</p>
									<p className='text-muted-foreground'>{organization.address}</p>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<OrganizationUserManagement organizationId={aParams.id} roles={roles} />
		</div>
	);
}
