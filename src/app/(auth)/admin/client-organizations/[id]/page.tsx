
import { OrganizationUserManagement } from '@/components/app/admin/client-organizations/organization-user-management';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthService } from '@/services/api/auth.service';
import { MasterDataService } from '@/services/api/master-data.service';
import { Building, Globe, Mail, MapPin, Phone, UserCheck } from 'lucide-react';
import { notFound } from 'next/navigation';
import { OrganizationJobseekerList } from '@/components/app/admin/client-organizations/organization-jobseeker-list';

async function getData(id: string) {
	try {
		const [orgRes, rolesRes] = await Promise.all([
			MasterDataService.clientOrganization.getDetails(id),
			AuthService.getRoles(),
		]);

		return {
			organization: orgRes.body,
			roles: rolesRes.body?.filter((role) => {
				if (orgRes.body?.isClient && role.roleCode?.startsWith('CLIENT_')) return true;
				if (orgRes.body?.isExaminer && role.roleCode?.startsWith('EXAMINER_')) return true;
				return false;
			}),
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
		<div className='space-y-4'>
			<div className='flex justify-between items-start'>
				<div>
					<h1 className='text-3xl font-headline font-bold'>{organization.nameEn}</h1>
					<p className='text-muted-foreground'>{organization.nameBn}</p>
				</div>
			</div>

			<Card className='glassmorphism'>
				<CardContent className='pt-5'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm'>
						<div className='flex items-center gap-3'>
							<UserCheck className='h-5 w-5 text-muted-foreground' />
							<div className='flex items-center gap-2'>
								<span className='font-medium'>Roles:</span>
								{organization.isClient && <Badge variant='success'>Client</Badge>}
								{organization.isExaminer && <Badge variant='info'>Examiner</Badge>}
							</div>
						</div>
						{organization.clientId && (
							<div className='flex items-center gap-3'>
								<span className='font-medium'>Client ID:</span>
								<strong>{organization.clientId}</strong>
							</div>
						)}
						{organization.organizationType && (
							<div className='flex items-center gap-3'>
								<Building className='h-5 w-5 text-muted-foreground' />
								<div>
									<p className='font-medium'>Type</p>
									<p className='text-muted-foreground'>{organization.organizationType.nameEn}</p>
								</div>
							</div>
						)}
						{organization.email && (
							<div className='flex items-center gap-3'>
								<Mail className='h-5 w-5 text-muted-foreground' />
								<div>
									<p className='font-medium'>Email</p>
									<p className='text-muted-foreground'>{organization.email}</p>
								</div>
							</div>
						)}
						{organization.website && (
							<div className='flex items-center gap-3'>
								<Globe className='h-5 w-5 text-muted-foreground' />
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
						{organization.contactPersonName && (
							<div className='flex items-center gap-3'>
								<Phone className='h-5 w-5 text-muted-foreground' />
								<div>
									<p className='font-medium'>Contact Person</p>
									<p className='text-muted-foreground'>
										{organization.contactPersonName}{' '}
										{organization?.contactNumber && <>({organization.contactNumber})</>}
									</p>
								</div>
							</div>
						)}
						{organization.address && (
							<div className='flex items-start gap-3 md:col-span-3'>
								<MapPin className='h-5 w-5 mt-0.5 text-muted-foreground' />
								<div>
									<p className='font-medium'>Address</p>
									<p className='text-muted-foreground'>{organization.address}</p>
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<Tabs defaultValue='users' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 max-w-md mx-auto bg-white rounded-lg'>
					<TabsTrigger value='users'>Organization Users</TabsTrigger>
					<TabsTrigger value='jobseekers'>Jobseekers</TabsTrigger>
				</TabsList>
				<TabsContent value='users'>
					<OrganizationUserManagement organizationId={aParams.id} roles={roles} />
				</TabsContent>
				<TabsContent value='jobseekers'>
					<OrganizationJobseekerList organizationId={aParams.id} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
