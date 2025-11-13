'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Jobseeker, JobseekerSkill } from '@/interfaces/jobseeker.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';
import { makeDownloadURL, makePreviewURL } from '@/lib/file-oparations';
import { JobseekerProfileService } from '@/services/api/jobseeker-profile.service';
import { format, parseISO } from 'date-fns';
import {
	Award,
	BookCopy,
	BookOpen,
	Briefcase,
	Download,
	FileText,
	GraduationCap,
	Heart,
	Languages,
	Linkedin,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Star,
	User,
	Video,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import { Separator } from '../../ui/separator';

interface JobseekerProfileViewProps {
	jobseeker?: Jobseeker;
	jobseekerId?: string;
}

const formatDateRange = (fromDate: string, toDate?: string, isPresent?: boolean) => {
	const start = format(parseISO(fromDate), 'MMM yyyy');
	const end = isPresent ? 'Present' : toDate ? format(parseISO(toDate), 'MMM yyyy') : '';
	return `${start} - ${end}`;
};

export function JobseekerProfileView({
	jobseeker: initialJobseeker,
	jobseekerId,
}: JobseekerProfileViewProps) {
	const [jobseeker, setJobseeker] = useState<Jobseeker | null | undefined>(initialJobseeker);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!initialJobseeker && jobseekerId) {
			setIsLoading(true);
			JobseekerProfileService.getProfile(jobseekerId)
				.then((res) => setJobseeker(res.body))
				.catch((err) => {
					toast.error({
						description: err.message || 'Could not fetch jobseeker details.',
					});
					setJobseeker(null);
				})
				.finally(() => setIsLoading(false));
		} else {
			setJobseeker(initialJobseeker);
		}
	}, [initialJobseeker, jobseekerId]);

	if (isLoading) {
		return (
			<div className='flex h-96 items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		);
	}

	if (!jobseeker) {
		return <div className='text-center p-8'>Could not load jobseeker profile.</div>;
	}

	const {
		personalInfo,
		spouse,
		children,
		education,
		experiences,
		skills,
		certifications,
		languages,
		publications,
		awards,
		trainings,
		resume,
	} = jobseeker;

	const formatAddress = (
		addressLine?: string,
		upazila?: ICommonMasterData,
		district?: ICommonMasterData,
		division?: ICommonMasterData,
		postCode?: number
	) => {
		return [addressLine, upazila?.nameEn, district?.nameEn, division?.nameEn, postCode]
			.filter(Boolean)
			.join(', ');
	};

	const DetailItem = ({ label, value }: { label: string; value?: React.ReactNode }) =>
		value ? (
			<div>
				<p className='text-sm text-muted-foreground'>{label}</p>
				<p className='font-medium'>{value}</p>
			</div>
		) : null;

	console.log(makePreviewURL(personalInfo.profileImage?.filePath))

	return (
		<div className='p-2 sm:p-4 md:p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row items-start gap-6'>
				<Avatar className='h-28 w-28 border-4 border-background shadow-md'>
					<AvatarImage
						src={makePreviewURL(personalInfo.profileImage?.filePath)}
						alt={personalInfo.fullName}
					/>
					<AvatarFallback>
						{personalInfo.firstName?.[0]}
						{personalInfo.lastName?.[0]}
					</AvatarFallback>
				</Avatar>
				<div className='flex-1'>
					<h1 className='text-3xl font-bold font-headline'>{personalInfo.fullName}</h1>
					<p className='text-lg text-muted-foreground'>{personalInfo.careerObjective}</p>
					<div className='flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2'>
						{personalInfo?.email && (
							<span className='flex items-center gap-2'>
								<Mail className='h-4 w-4' /> {personalInfo.email}
							</span>
						)}
						{personalInfo?.phone && (
							<span className='flex items-center gap-2'>
								<Phone className='h-4 w-4' /> {personalInfo.phone}
							</span>
						)}
					</div>
					<div className='flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2'>
						{personalInfo.linkedInProfile && (
							<a
								href={personalInfo.linkedInProfile}
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center gap-2 hover:text-primary'
							>
								<Linkedin className='h-4 w-4' /> LinkedIn
							</a>
						)}
						{personalInfo.videoProfile && (
							<a
								href={personalInfo.videoProfile}
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center gap-2 hover:text-primary'
							>
								<Video className='h-4 w-4' /> Video Profile
							</a>
						)}
					</div>
				</div>
				<div className='flex-shrink-0'>
					{resume && (
						<Button asChild>
							<Link href={makeDownloadURL(resume.file)} target='_blank' download>
								<Download className='mr-2 h-4 w-4' /> Download CV
							</Link>
						</Button>
					)}
				</div>
			</div>

			<Separator />

			<Card className='border'>
				<CardHeader>
					<CardTitle className='flex items-center gap-3'>
						<div className='bg-primary/10 text-primary p-2 rounded-full'>
							<User className='h-5 w-5' />
						</div>
						Personal Information
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6 text-sm'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6'>
						<DetailItem label="Father's Name" value={personalInfo.fatherName} />
						<DetailItem label="Mother's Name" value={personalInfo.motherName} />
						{personalInfo.dateOfBirth && (
							<DetailItem
								label='Date of Birth'
								value={format(parseISO(personalInfo.dateOfBirth), 'do MMM, yyyy')}
							/>
						)}
						<DetailItem label='Gender' value={personalInfo.genderDTO?.nameEn || personalInfo.gender} />
						<DetailItem
							label='Marital Status'
							value={personalInfo.maritalStatusDTO?.nameEn || personalInfo.maritalStatus}
						/>
						<DetailItem label='Nationality' value={personalInfo.nationality} />
						<DetailItem label='Religion' value={personalInfo.religionDTO?.nameEn || personalInfo.religion} />
						<DetailItem label='NID' value={personalInfo.nid} />
						<DetailItem label='Passport No.' value={personalInfo.passportNo} />
					</div>
					<Separator />
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'>
						<div>
							<h4 className='font-semibold text-muted-foreground mb-2 flex items-center gap-2'>
								<MapPin className='h-4 w-4' /> Present Address
							</h4>
							<address className='not-italic'>
								{formatAddress(
									personalInfo.presentAddress,
									personalInfo.presentUpazila,
									personalInfo.presentDistrict,
									personalInfo.presentDivision,
									personalInfo.presentPostCode
								)}
							</address>
						</div>
						<div>
							<h4 className='font-semibold text-muted-foreground mb-2 flex items-center gap-2'>
								<MapPin className='h-4 w-4' /> Permanent Address
							</h4>
							<address className='not-italic'>
								{formatAddress(
									personalInfo.permanentAddress,
									personalInfo.permanentUpazila,
									personalInfo.permanentDistrict,
									personalInfo.permanentDivision,
									personalInfo.permanentPostCode
								)}
							</address>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 space-y-6'>
					{experiences?.length > 0 && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-full'>
										<Briefcase className='h-5 w-5' />
									</div>
									Professional Experience
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='relative pl-6'>
									<div className='absolute left-[7px] top-1 h-full w-0.5 bg-border -z-10'></div>
									{experiences.map((exp, index) => (
										<div key={index} className='relative pl-6 pb-6 last:pb-0'>
											<div className='absolute -left-1.5 top-1 h-4 w-4 rounded-full bg-primary border-4 border-background'></div>
											<h3 className='font-semibold'>{exp.positionTitle}</h3>
											<p className='text-xs text-muted-foreground'>
												{formatDateRange(exp.joinDate, exp.resignDate, exp.isCurrent)}
											</p>
											<ul className='list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1'>
												{exp.responsibilities.split('\n').map((resp, i) => (
													<li key={i}>{resp}</li>
												))}
											</ul>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{education?.length > 0 && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-full'>
										<GraduationCap className='h-5 w-5' />
									</div>
									Academic History
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{education.map((edu, index) => (
									<div key={index}>
										<h3 className='font-semibold'>{edu.degreeTitle}</h3>
										<p className='text-sm text-muted-foreground'>{edu.institution.nameEn}</p>
										<p className='text-xs text-muted-foreground'>Graduated: {edu.passingYear}</p>
									</div>
								))}
							</CardContent>
						</Card>
					)}

					{(spouse || (children && children?.length > 0)) && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-full'>
										<Heart className='h-5 w-5' />
									</div>
									Family Information
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{spouse && (
									<div>
										<h3 className='font-semibold text-md mb-2'>Spouse</h3>
										<div className='text-sm space-y-1'>
											<p>
												<span className='font-medium'>Name:</span> {spouse.name}
											</p>
											<p>
												<span className='font-medium'>Profession:</span> {spouse.profession}
											</p>
										</div>
									</div>
								)}
								{children && children.length > 0 && (
									<div>
										<h3 className='font-semibold text-md mb-2'>Children</h3>
										<div className='space-y-2'>
											{children.map((child, index) => (
												<div key={index} className='text-sm'>
													<p>
														<span className='font-medium'>{child.name}</span> (
														{child.genderDTO?.nameEn || child.gender})
													</p>
													<p className='text-xs text-muted-foreground'>
														Born on {format(parseISO(child.dob), 'do MMM, yyyy')}
													</p>
												</div>
											))}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>

				<div className='lg:col-span-1 space-y-6'>
					{skills?.length > 0 && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-full'>
										<Star className='h-5 w-5' />
									</div>
									Skills
								</CardTitle>
							</CardHeader>
							<CardContent className='flex flex-col gap-2'>
								{skills.map((skill: JobseekerSkill) => (
									<div key={skill.id} className='text-sm'>
										<p className='font-semibold'>{skill.skill?.nameEn}</p>
										<p className='text-xs text-muted-foreground'>
											{skill.proficiency} &middot; {skill.yearsOfExperience} years
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					)}
					{trainings?.length > 0 && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-lg'>
										<BookCopy className='h-5 w-5' />
									</div>
									Trainings
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								{trainings.map((training, index) => (
									<div key={index}>
										<p className='font-semibold text-sm'>{training.name}</p>
										<p className='text-xs text-muted-foreground'>{training.institutionName}</p>
									</div>
								))}
							</CardContent>
						</Card>
					)}
					{languages?.length > 0 && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-lg'>
										<Languages className='h-5 w-5' />
									</div>
									Languages
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								{languages.map((lang) => (
									<div key={lang.id} className='flex justify-between text-sm'>
										<span>{lang.language?.nameEn}</span>
										<span className='text-muted-foreground'>{lang.proficiency}</span>
									</div>
								))}
							</CardContent>
						</Card>
					)}
					{certifications?.length > 0 && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-lg'>
										<FileText className='h-5 w-5' />
									</div>
									Certifications
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								{certifications.map((cert, index) => (
									<div key={index}>
										<p className='font-semibold text-sm'>{cert.certification?.nameEn}</p>
										<p className='text-xs text-muted-foreground'>
											{cert.issuingAuthority} -{' '}
											{cert.issueDate && format(parseISO(cert.issueDate), 'MMM yyyy')}
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					)}

					{publications?.length > 0 && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-lg'>
										<BookOpen className='h-5 w-5' />
									</div>
									Publications
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								{publications.map((pub, index) => (
									<div key={index}>
										<a
											href={pub.url}
											target='_blank'
											rel='noopener noreferrer'
											className='font-semibold text-sm hover:underline'
										>
											{pub.title}
										</a>
										<p className='text-xs text-muted-foreground'>
											{pub.publisher} - {format(parseISO(pub.publicationDate), 'MMM yyyy')}
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					)}

					{awards?.length > 0 && (
						<Card className='border'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3'>
									<div className='bg-primary/10 text-primary p-2 rounded-lg'>
										<Award className='h-5 w-5' />
									</div>
									Awards
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-3'>
								{awards.map((award, index) => (
									<div key={index}>
										<p className='font-semibold text-sm'>{award.name}</p>
										<p className='text-xs text-muted-foreground'>
											{award.description} - {format(parseISO(award.date), 'MMM yyyy')}
										</p>
									</div>
								))}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
