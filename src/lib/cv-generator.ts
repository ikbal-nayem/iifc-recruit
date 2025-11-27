
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
	} else {
		try {
			imageDataUrl = (await toDataURL(COMMON_URL.DUMMY_USER_AVATAR)) as string;
		} catch (error) {
			console.error('Could not fetch placeholder image for CV:', error);
		}
	}

	const contactItems = [
		personalInfo.email,
		personalInfo.phone,
		personalInfo.permanentAddress
			? `${personalInfo.permanentAddress}, ${personalInfo.permanentUpazila?.nameEn}, ${personalInfo.permanentDistrict?.nameEn}`
			: null,
	]
		.filter(Boolean)
		.join(' | ');

	return {
		columns: [
			{
				stack: [
					{ text: personalInfo.fullName?.toUpperCase(), style: 'name' },
					personalInfo.careerObjective ? { text: personalInfo.careerObjective, style: 'headline' } : {},
					contactItems ? { text: contactItems, style: 'contact' } : {},
					personalInfo.linkedInProfile
						? {
								text: `LinkedIn: ${personalInfo.linkedInProfile}`,
								style: 'contact',
								link: personalInfo.linkedInProfile,
								color: 'blue',
						  }
						: {},
				],
			},
			imageDataUrl ? { image: imageDataUrl, width: 80, alignment: 'right' } : {},
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

	return {
		stack: [
			{ text: title, style: 'header' },
			{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#cccccc' }] },
			{
				stack: [content],
				margin: [0, 10, 0, 0],
			},
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
								exp.isCurrent ? 'Present' : exp.resignDate ? format(parseISO(exp.resignDate), 'MMM yyyy') : ''
							}`,
							style: 'date',
							alignment: 'right',
						},
					],
				},
				{ text: exp.organizationNameEn, italics: true, style: 'paragraph', margin: [0, 2, 0, 5] },
				exp.responsibilities
					? {
							ul: (exp.responsibilities || '').split('\n').map((r) => ({ text: r, style: 'paragraph' })),
							margin: [10, 0, 0, 0],
					  }
					: {},
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
				{
					text: `Major: ${edu.domainNameEn} | CGPA: ${edu.cgpa || 'N/A'}`,
					style: 'paragraph',
					color: '#64748B',
				},
			],
			margin: [0, 0, 0, 10],
		})),
	});
};

const generateSkills = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.skills || jobseeker.skills.length === 0) return [];
	return generateSection('Skills', {
		columns: [
			{
				ul: jobseeker.skills
					.slice(0, Math.ceil(jobseeker.skills.length / 2))
					.map((skill) => ({ text: skill.skill?.nameEn, style: 'paragraph' })),
			},
			{
				ul: jobseeker.skills
					.slice(Math.ceil(jobseeker.skills.length / 2))
					.map((skill) => ({ text: skill.skill?.nameEn, style: 'paragraph' })),
			},
		],
	});
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
					text: `${cert.issuingAuthority} | Issued on ${
						cert.issueDate ? format(parseISO(cert.issueDate), 'MMM yyyy') : 'N/A'
					}`,
					style: 'date',
				},
			],
			margin: [0, 0, 0, 10],
		})),
	});
};

const generateLanguages = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.languages || jobseeker.languages.length === 0) return [];
	return generateSection('Languages', {
		columns: jobseeker.languages.map((lang) => ({
			text: `${lang.language?.nameEn} (${lang.proficiencyDTO?.nameEn})`,
			style: 'paragraph',
		})),
	});
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
	return generateSection(
		'Interested Outsourcing Posts',
		{
			ul: jobseeker.interestIn.map((interest) => ({
				stack: [
					{ text: interest.post?.nameBn, style: 'paragraph', bold: true },
					{
						text: interest.post?.outsourcingCategory?.nameBn || '',
						style: 'paragraph',
						color: '#64748B',
						fontSize: 9,
					},
				],
				margin: [0, 0, 0, 5],
			})),
		}
	);
};

const generatePersonalInfo = (jobseeker: Jobseeker): Content => {
	const { personalInfo } = jobseeker;
	const details = [
		{ label: "Father's Name", value: personalInfo.fatherName },
		{ label: "Mother's Name", value: personalInfo.motherName },
		{
			label: 'Date of Birth',
			value: personalInfo.dateOfBirth ? format(parseISO(personalInfo.dateOfBirth), 'do MMM, yyyy') : '',
		},
		{ label: 'Gender', value: personalInfo.genderDTO?.nameEn },
		{ label: 'Marital Status', value: personalInfo.maritalStatusDTO?.nameEn },
		{ label: 'Nationality', value: personalInfo.nationality },
		{ label: 'NID', value: personalInfo.nid },
	].filter((item) => item.value);

	return generateSection('Personal Details', {
		columns: [
			{
				stack: details.slice(0, Math.ceil(details.length / 2)).map((item) => ({
					columns: [
						{ text: `${item.label}:`, bold: true, width: 'auto' },
						{ text: item.value, width: '*', margin: [4, 0, 0, 0] },
					],
					columnGap: 5,
					margin: [0, 0, 0, 3],
				})),
			},
			{
				stack: details.slice(Math.ceil(details.length / 2)).map((item) => ({
					columns: [
						{ text: `${item.label}:`, bold: true, width: 'auto' },
						{ text: item.value, width: '*', margin: [4, 0, 0, 0] },
					],
					columnGap: 5,
					margin: [0, 0, 0, 3],
				})),
			},
		],
	});
};

export const generateCv = async (jobseeker: Jobseeker) => {
	const docDefinition: TDocumentDefinitions = {
		content: [
			await generateHeader(jobseeker),
			generatePersonalInfo(jobseeker),
			generateInterests(jobseeker),
			generateExperience(jobseeker),
			generateEducation(jobseeker),
			generateSkills(jobseeker),
			generateTrainings(jobseeker),
			generateCertifications(jobseeker),
			generateLanguages(jobseeker),
			generatePublications(jobseeker),
			generateAwards(jobseeker),
		],
		styles: {
			name: {
				fontSize: 24,
				bold: true,
				color: '#172554',
				marginBottom: 2,
			},
			headline: {
				fontSize: 11,
				color: '#475569',
				marginBottom: 5,
			},
			contact: {
				fontSize: 9,
				color: '#64748B',
			},
			header: {
				fontSize: 14,
				bold: true,
				color: '#1E3A8A',
				marginBottom: 5,
			},
			subheader: {
				fontSize: 11,
				bold: true,
				color: '#334155',
			},
			date: {
				fontSize: 9,
				color: '#64748B',
			},
			paragraph: {
				fontSize: 10,
				color: '#475569',
			},
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
