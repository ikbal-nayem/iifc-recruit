
import { COMMON_URL } from '@/constants/common.constant';
import { Jobseeker } from '@/interfaces/jobseeker.interface';
import { generatePDF } from '@/services/pdf/pdf.service';
import { format, parseISO } from 'date-fns';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { makePreviewURL } from './file-oparations';

const toDataURL = (url: string) =>
	fetch(url)
		.then((response) => response.blob())
		.then(
			(blob) =>
				new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result);
					reader.onerror = reject;
					reader.readAsDataURL(blob);
				})
		);

const generateHeader = async (jobseeker: Jobseeker): Promise<Content> => {
	const { personalInfo } = jobseeker;
	let imageDataUrl: string | undefined;

	if (personalInfo.profileImage?.filePath) {
		try {
			imageDataUrl = (await toDataURL(makePreviewURL(personalInfo.profileImage.filePath))) as string;
		} catch (error) {
			console.error('Could not fetch profile image for CV:', error);
		}
	}

	return {
		columns: [
			{
				stack: [
					{ text: personalInfo.fullName?.toUpperCase(), style: 'name' },
					{ text: personalInfo.careerObjective, style: 'headline' },
				],
				width: '*',
			},
			imageDataUrl
				? {
						image: imageDataUrl,
						width: 80,
						height: 80,
						alignment: 'right',
				  }
				: {},
		],
		marginBottom: 20,
	};
};

const generateSection = (
	title: string,
	content: Content,
	pageBreak: 'before' | 'after' | 'none' = 'none'
): Content => {
	if (Array.isArray(content) && content.length === 0) {
		return [];
	}
	if (
		Array.isArray(content) &&
		content.every((item) => typeof item === 'object' && Object.keys(item).length === 0)
	) {
		return [];
	}

	return {
		stack: [
			{ text: title, style: 'header' },
			{
				canvas: [{ type: 'line', x1: 0, y1: 2, x2: 515, y2: 2, lineWidth: 0.5, lineColor: '#cccccc' }],
				margin: [0, 0, 0, 10],
			},
			content,
		],
		marginBottom: 15,
		pageBreak,
	};
};

const generateExperience = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.experiences || jobseeker.experiences.length === 0) return [];
	return generateSection('Work Experience', {
		stack: jobseeker.experiences.map((exp) => ({
			stack: [
				{
					columns: [
						{ text: exp.positionTitle, style: 'subheader' },
						{
							text: `${format(parseISO(exp.joinDate), 'MMM yyyy')} - ${
								exp.isCurrent ? 'Present' : format(parseISO(exp.resignDate!), 'MMM yyyy')
							}`,
							style: 'date',
							alignment: 'right',
						},
					],
				},
				{ text: exp.organizationNameEn, italics: true, style: 'paragraph', margin: [0, 0, 0, 5] },
				{
					ul: (exp.responsibilities || '').split('\n').map((r) => ({ text: r, style: 'paragraph' })),
					margin: [10, 0, 0, 0],
				},
			],
			margin: [0, 0, 0, 15],
		})),
	});
};

const generateEducation = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.education || jobseeker.education.length === 0) return [];
	return generateSection('Education', {
		stack: jobseeker.education.map((edu) => ({
			stack: [
				{
					columns: [
						{ text: edu.degreeTitle, style: 'subheader' },
						{ text: `Passing Year: ${edu.passingYear}`, style: 'date', alignment: 'right' },
					],
				},
				{ text: edu.institution.nameEn, italics: true, style: 'paragraph' },
			],
			margin: [0, 0, 0, 10],
		})),
	});
};

const generateSkills = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.skills || jobseeker.skills.length === 0) return [];
	return {
		stack: [
			{ text: 'Skills', style: 'sidebarHeader' },
			{
				ul: jobseeker.skills.map(
					(skill) => `${skill.skill?.nameEn} (${skill.yearsOfExperience} yrs)`
				),
				style: 'sidebarList',
			},
		],
		marginBottom: 15,
	};
};

const generateTrainings = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.trainings || jobseeker.trainings.length === 0) return [];
	return generateSection('Trainings & Courses', {
		ul: jobseeker.trainings.map((training) => ({
			stack: [
				{ text: training.name, style: 'subheader' },
				{
					text: `${training.institutionName} | ${format(parseISO(training.startDate), 'MMM yyyy')} - ${format(
						parseISO(training.endDate),
						'MMM yyyy'
					)}`,
					style: 'date',
				},
			],
			margin: [0, 0, 0, 10],
		})),
	});
};

const generateCertifications = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.certifications || jobseeker.certifications.length === 0) return [];
	return generateSection('Certifications', {
		ul: jobseeker.certifications.map((cert) => ({
			stack: [
				{ text: cert.certification?.nameEn, style: 'subheader' },
				{
					text: `${cert.issuingAuthority} | Issued on ${format(parseISO(cert.issueDate!), 'MMM yyyy')}`,
					style: 'date',
				},
			],
			margin: [0, 0, 0, 10],
		})),
	});
};

const generateLanguages = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.languages || jobseeker.languages.length === 0) return [];
	return {
		stack: [
			{ text: 'Languages', style: 'sidebarHeader' },
			{
				ul: jobseeker.languages.map((lang) => `${lang.language?.nameEn} (${lang.proficiencyDTO?.nameEn})`),
				style: 'sidebarList',
			},
		],
		marginBottom: 15,
	};
};

const generatePublications = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.publications || jobseeker.publications.length === 0) return [];
	return generateSection('Publications', {
		ul: jobseeker.publications.map((pub) => ({
			stack: [
				{ text: pub.title, style: 'subheader', link: pub.url, color: 'blue' },
				{
					text: `${pub.publisher} | ${format(parseISO(pub.publicationDate), 'MMM yyyy')}`,
					style: 'date',
				},
			],
			margin: [0, 0, 0, 10],
		})),
	});
};

const generateAwards = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.awards || jobseeker.awards.length === 0) return [];
	return generateSection('Awards', {
		ul: jobseeker.awards.map((award) => ({
			stack: [
				{ text: award.name, style: 'subheader' },
				{
					text: `${award.description} | Awarded on ${format(parseISO(award.date), 'MMM yyyy')}`,
					style: 'date',
				},
			],
			margin: [0, 0, 0, 10],
		})),
	});
};

const generateInterests = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.interestIn || jobseeker.interestIn.length === 0) return [];
	return {
		stack: [
			{ text: 'Interests', style: 'sidebarHeader' },
			{
				ul: jobseeker.interestIn.map(
					(interest) => `${interest.post?.nameBn} (${interest.post?.outsourcingCategory?.nameBn})`
				),
				style: 'sidebarList',
			},
		],
		marginBottom: 15,
	};
};

const generateContactInfo = (jobseeker: Jobseeker): Content => {
	const { personalInfo } = jobseeker;
	const contactItems = [
		personalInfo.email ? { text: `📧  ${personalInfo.email}`, margin: [0, 0, 0, 5] } : null,
		personalInfo.phone ? { text: `📱  ${personalInfo.phone}`, margin: [0, 0, 0, 5] } : null,
		personalInfo.permanentAddress
			? {
					text: `🏠  ${personalInfo.permanentAddress}, ${personalInfo.permanentUpazila?.nameEn}, ${personalInfo.permanentDistrict?.nameEn}`,
					margin: [0, 0, 0, 5],
			  }
			: null,
		personalInfo.linkedInProfile
			? {
					text: `🔗  LinkedIn Profile`,
					link: personalInfo.linkedInProfile,
					color: 'blue',
					margin: [0, 0, 0, 5],
			  }
			: null,
	].filter(Boolean);

	return {
		stack: [{ text: 'Contact', style: 'sidebarHeader' }, { stack: contactItems, style: 'sidebarList' }],
		marginBottom: 15,
	};
};

export const generateCv = async (jobseeker: Jobseeker) => {
	const docDefinition: TDocumentDefinitions = {
		content: [
			await generateHeader(jobseeker),
			{
				columns: [
					{
						width: '65%',
						stack: [
							generateExperience(jobseeker),
							generateEducation(jobseeker),
							generateTrainings(jobseeker),
							generateCertifications(jobseeker),
							generatePublications(jobseeker),
							generateAwards(jobseeker),
						],
					},
					{ width: '5%', text: '' }, // Spacer
					{
						width: '30%',
						stack: [
							generateContactInfo(jobseeker),
							generateSkills(jobseeker),
							generateLanguages(jobseeker),
							generateInterests(jobseeker),
						],
					},
				],
			},
		],
		styles: {
			name: {
				fontSize: 26,
				bold: true,
				color: '#172554', // Dark Blue
				marginBottom: 2,
			},
			headline: {
				fontSize: 11,
				color: '#475569', // Slate Gray
				marginBottom: 15,
			},
			header: {
				fontSize: 14,
				bold: true,
				color: '#1E3A8A', // Medium Blue
				marginBottom: 5,
			},
			subheader: {
				fontSize: 11,
				bold: true,
				color: '#334155', // Dark Slate Gray
			},
			date: {
				fontSize: 9,
				color: '#64748B', // Light Slate Gray
			},
			paragraph: {
				fontSize: 10,
				color: '#475569',
			},
			sidebarHeader: {
				fontSize: 12,
				bold: true,
				color: '#1E3A8A',
				marginBottom: 5,
			},
			sidebarList: {
				fontSize: 9,
				color: '#334155',
			},
		},
		images: {
			placeholder: location.origin + COMMON_URL.DUMMY_USER_AVATAR,
		},
		defaultStyle: {
			font: 'Kalpurush',
			fontSize: 10,
			lineHeight: 1.2,
		},
		pageMargins: [40, 40, 40, 40],
	};

	generatePDF(docDefinition, { action: 'open', fileName: `CV-${jobseeker.personalInfo.fullName}.pdf` });
};
