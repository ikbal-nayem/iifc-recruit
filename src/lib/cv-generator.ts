
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

const generateCvHeader = async (jobseeker: Jobseeker): Promise<Content> => {
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
				width: '*',
				stack: [
					{ text: personalInfo.fullName, style: 'name' },
					{ text: personalInfo.careerObjective || '', style: 'headline' },
					{
						columns: [
							{
								stack: [
									{ text: `📧 ${personalInfo.email}` },
									{ text: `📱 ${personalInfo.phone}` },
									{ text: `📍 ${personalInfo.presentAddress || ''}` },
								],
							},
							{
								stack: [
									personalInfo.linkedInProfile
										? { text: `🔗 ${personalInfo.linkedInProfile}`, link: personalInfo.linkedInProfile }
										: '',
								],
							},
						],
						style: 'contactInfo',
					},
				],
			},
			{
				width: 100,
				image: imageDataUrl || 'placeholder',
				height: 100,
				alignment: 'right',
			},
		],
		marginBottom: 20,
	};
};

const generateSection = (title: string, content: Content, pageBreak: 'before' | 'after' | 'none' = 'none'): Content => {
    if (Array.isArray(content) && content.every(item => typeof item === 'object' && Object.keys(item).length === 0)) {
        return [];
    }
    if(Array.isArray(content) && content.length === 0) return [];
	return {
		stack: [
			{ text: title, style: 'header' },
			{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#cccccc' }] },
			{
                ...content,
                margin: [0, 10, 0, 0]
            },
		],
		marginBottom: 15,
		pageBreak: pageBreak,
	};
};

const generateExperience = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.experiences || jobseeker.experiences.length === 0) return [];
	return generateSection('Work Experience', {
		ul: jobseeker.experiences.map((exp) => ({
			stack: [
				{ text: exp.positionTitle, style: 'subheader' },
				{ text: exp.organizationNameEn, italics: true },
				{ text: `${format(parseISO(exp.joinDate), 'MMM yyyy')} - ${exp.isCurrent ? 'Present' : format(parseISO(exp.resignDate!), 'MMM yyyy')}`, style: 'date' },
				{ text: exp.responsibilities || '', style: 'paragraph' }
			],
			margin: [0, 0, 0, 10]
		}))
	});
};

const generateEducation = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.education || jobseeker.education.length === 0) return [];
	return generateSection('Education', {
		ul: jobseeker.education.map((edu) => ({
			stack: [
				{ text: edu.degreeTitle, style: 'subheader' },
				{ text: edu.institution.nameEn, italics: true },
				{ text: `Passing Year: ${edu.passingYear}`, style: 'date' },
			],
			margin: [0, 0, 0, 10]
		}))
	});
};

const generateSkills = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.skills || jobseeker.skills.length === 0) return [];
	return generateSection('Skills', {
        columns: [
            {
                width: '50%',
                ul: jobseeker.skills.slice(0, Math.ceil(jobseeker.skills.length / 2)).map(skill => ({
                    text: `${skill.skill?.nameEn} (${skill.proficiencyDTO?.nameEn})`
                }))
            },
            {
                width: '50%',
                ul: jobseeker.skills.slice(Math.ceil(jobseeker.skills.length / 2)).map(skill => ({
                    text: `${skill.skill?.nameEn} (${skill.proficiencyDTO?.nameEn})`
                }))
            }
        ]
	});
};

const generateTrainings = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.trainings || jobseeker.trainings.length === 0) return [];
	return generateSection('Trainings', {
		ul: jobseeker.trainings.map(training => ({
			stack: [
				{ text: training.name, style: 'subheader' },
				{ text: training.institutionName, italics: true },
				{ text: `${format(parseISO(training.startDate), 'MMM yyyy')} - ${format(parseISO(training.endDate), 'MMM yyyy')}`, style: 'date' },
			],
			margin: [0, 0, 0, 10]
		}))
	});
};

const generateCertifications = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.certifications || jobseeker.certifications.length === 0) return [];
	return generateSection('Certifications', {
		ul: jobseeker.certifications.map(cert => ({
			stack: [
				{ text: cert.certification?.nameEn, style: 'subheader' },
				{ text: `Issued by ${cert.issuingAuthority}`, italics: true },
				{ text: `Issued on ${format(parseISO(cert.issueDate!), 'MMM yyyy')}`, style: 'date' },
			],
			margin: [0, 0, 0, 10]
		}))
	});
};

const generateLanguages = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.languages || jobseeker.languages.length === 0) return [];
	return generateSection('Languages', {
		ul: jobseeker.languages.map(lang => `${lang.language?.nameEn} (${lang.proficiencyDTO?.nameEn})`)
	});
};

const generatePublications = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.publications || jobseeker.publications.length === 0) return [];
	return generateSection('Publications', {
		ul: jobseeker.publications.map(pub => ({
			stack: [
				{ text: pub.title, style: 'subheader', link: pub.url, color: 'blue' },
				{ text: `Published by ${pub.publisher}`, italics: true },
				{ text: `on ${format(parseISO(pub.publicationDate), 'MMM yyyy')}`, style: 'date' },
			],
			margin: [0, 0, 0, 10]
		}))
	});
};

const generateAwards = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.awards || jobseeker.awards.length === 0) return [];
	return generateSection('Awards', {
		ul: jobseeker.awards.map(award => ({
			stack: [
				{ text: award.name, style: 'subheader' },
				{ text: award.description, italics: true },
				{ text: `Awarded on ${format(parseISO(award.date), 'MMM yyyy')}`, style: 'date' },
			],
			margin: [0, 0, 0, 10]
		}))
	});
};

const generatePersonalInfo = (jobseeker: Jobseeker): Content => {
	const personalInfo = jobseeker.personalInfo;
	const tableRow = (label: string, value: string | undefined) => [
		{ text: label, style: 'tableLabel' },
		{ text: value || '', style: 'tableValue' },
	];
	return generateSection('Personal Information', {
        columns: [
            {
                width: '50%',
                layout: 'noBorders',
                table: {
                    body: [
                        tableRow("Father's Name", personalInfo.fatherName),
                        tableRow("Mother's Name", personalInfo.motherName),
                        tableRow('Date of Birth', personalInfo.dateOfBirth ? format(parseISO(personalInfo.dateOfBirth), 'do MMM, yyyy') : ''),
                        tableRow('Gender', personalInfo.genderDTO?.nameEn),
                        tableRow('Marital Status', personalInfo.maritalStatusDTO?.nameEn),
                    ]
                }
            },
            {
                width: '50%',
                layout: 'noBorders',
                table: {
                    body: [
                        tableRow('Nationality', personalInfo.nationality),
                        tableRow('Religion', personalInfo.religionDTO?.nameEn),
                        tableRow('NID', personalInfo.nid),
                        tableRow('Passport No.', personalInfo.passportNo),
                        tableRow('Permanent Address', personalInfo.permanentAddress),
                    ]
                }
            }
        ]
	});
}

export const generateCv = async (jobseeker: Jobseeker) => {
	const docDefinition: TDocumentDefinitions = {
		content: [
			await generateCvHeader(jobseeker),
			generatePersonalInfo(jobseeker),
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
                color: '#1E40AF', // A professional blue
                marginBottom: 5,
            },
            headline: {
                fontSize: 12,
                color: '#555555',
                marginBottom: 10,
            },
            contactInfo: {
                fontSize: 9,
                color: '#333333',
                marginBottom: 10,
            },
            header: {
                fontSize: 16,
                bold: true,
                color: '#333333',
                marginBottom: 5,
            },
            subheader: {
                fontSize: 11,
                bold: true,
                color: '#444444',
            },
            date: {
                fontSize: 9,
                color: '#777777',
                marginBottom: 3,
            },
            paragraph: {
                fontSize: 10,
                color: '#555555',
            },
            tableLabel: {
                bold: true,
                color: '#555555',
            },
            tableValue: {
                color: '#333333',
            }
        },
		images: {
			placeholder: location.origin + COMMON_URL.DUMMY_USER_AVATAR,
		},
		defaultStyle: {
			font: 'Kalpurush', // Using Kalpurush but design is english-centric, can be changed
			fontSize: 10,
			lineHeight: 1.2,
		}
	};

	generatePDF(docDefinition, { action: 'open', fileName: `CV-${jobseeker.personalInfo.fullName}.pdf` });
};

