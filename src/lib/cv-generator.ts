import { COMMON_URL } from '@/constants/common.constant';
import { Jobseeker } from '@/interfaces/jobseeker.interface';
import { generatePDF } from '@/services/pdf/pdf.service';
import { format } from 'date-fns';
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
	const personalInfo = jobseeker.personalInfo;
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
			{ text: 'ব্যক্তিগত তথ্য', style: 'header', alignment: 'center', width: '*' },
			{
				width: 120,
				alignment: 'right',
				stack: [
					{
						image: imageDataUrl || 'placeholder',
						width: 100,
						height: 100,
						alignment: 'center',
					},
					{ text: 'পাসপোর্ট সাইজ ছবি-০১ কপি', alignment: 'center', style: 'small' },
					{
						table: {
							widths: ['*'],
							body: [[' '], ['ক্রমিক নম্বর:']],
						},
						layout: 'noBorders',
						margin: [0, 10, 0, 0],
					},
				],
			},
		],
		marginBottom: 20,
	};
};

const generateGeneralInfo = (jobseeker: Jobseeker): Content => {
	const personalInfo = jobseeker.personalInfo;
	const tableRow = (label: string, value: string | undefined) => [
		{ text: label },
		{ text: ':' },
		{ text: value || '' },
	];

	return {
		stack: [
			{ text: 'ক. সাধারণ তথ্য:', style: 'subheader' },
			{
				layout: {
					defaultBorder: true,
					hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 1),
					vLineWidth: (i, node) => (i === 0 || i === node.table.widths?.length ? 1 : 1),
					hLineColor: (i, node) => '#dddddd',
					vLineColor: (i, node) => '#dddddd',
				},
				table: {
					widths: [120, 'auto', '*'],
					body: [
						tableRow('নাম', personalInfo.fullName),
						tableRow('পিতার নাম', personalInfo.fatherName),
						tableRow('মাতার নাম', personalInfo.motherName),
						tableRow('স্থায়ী ঠিকানা', personalInfo.permanentAddress),
						tableRow(
							'জন্ম তারিখ',
							personalInfo.dateOfBirth ? format(new Date(personalInfo.dateOfBirth), 'dd/MM/yyyy') : ''
						),
						tableRow('ধর্ম', personalInfo.religionDTO?.nameBn),
						tableRow('জাতীয় পরিচয়পত্র নম্বর', personalInfo.nid),
						tableRow('বৈবাহিক অবস্থা', personalInfo.maritalStatusDTO?.nameBn),
						tableRow('মোবাইল নম্বর', personalInfo.phone),
						tableRow('বর্তমান ঠিকানা/বাসস্থান', personalInfo.presentAddress),
					],
				},
			},
		],
		marginBottom: 15,
	};
};

const generateSpouseInfo = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.spouse) return { text: '' };
	const spouse = jobseeker.spouse;
	const tableRow = (label: string, value: string | undefined) => [
		{ text: label },
		{ text: ':' },
		{ text: value || '' },
	];
	return {
		stack: [
			{ text: 'খ. স্বামীর/স্ত্রীর তথ্য:', style: 'subheader' },
			{
				layout: 'lightHorizontalLines',
				table: {
					widths: [120, 'auto', '*'],
					body: [
						tableRow('নাম', spouse.name),
						tableRow('পেশা', spouse.profession),
						tableRow('নিজ জেলা', jobseeker.personalInfo.permanentDistrict?.nameBn),
					],
				},
			},
		],
		marginBottom: 15,
	};
};

const generateChildrenInfo = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.children || jobseeker.children.length === 0) return { text: '' };
	const header = [
		{ text: 'ক্রমিক নং', style: 'tableHeader' },
		{ text: 'নাম', style: 'tableHeader' },
		{ text: 'জন্ম তারিখ', style: 'tableHeader' },
		{ text: 'লিঙ্গ', style: 'tableHeader' },
	];
	const body = jobseeker.children.map((child, index) => [
		{ text: (index + 1).toString(), alignment: 'center' },
		child.name,
		format(new Date(child.dob), 'dd/MM/yyyy'),
		child.genderDTO?.nameBn || '',
	]);

	return {
		stack: [
			{ text: 'গ. ছেলে মেয়ের বিবরণ:', style: 'subheader' },
			{
				layout: 'lightHorizontalLines',
				table: {
					headerRows: 1,
					widths: ['auto', '*', '*', '*'],
					body: [header, ...body],
				},
			},
		],
		marginBottom: 15,
	};
};

const generateEducationInfo = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.education || jobseeker.education.length === 0) return { text: '' };
	const header = [
		{ text: 'ক্রমিক নং', style: 'tableHeader' },
		{ text: 'পরীক্ষা', style: 'tableHeader' },
		{ text: 'ফলাফল', style: 'tableHeader' },
		{ text: 'শিক্ষা প্রতিষ্ঠানের নাম', style: 'tableHeader' },
		{ text: 'পাসের সাল', style: 'tableHeader' },
	];
	const body = jobseeker.education.map((edu, index) => [
		{ text: (index + 1).toString(), alignment: 'center' },
		edu.degreeTitle,
		edu.resultSystem === 'GRADE' ? `${edu.cgpa}/${edu.outOfCgpa}` : edu.resultAchieved || '',
		edu.institution.nameEn,
		edu.passingYear,
	]);

	return {
		stack: [
			{ text: 'ঘ. শিক্ষাগত যোগ্যতা:', style: 'subheader' },
			{
				layout: 'lightHorizontalLines',
				table: {
					headerRows: 1,
					widths: ['auto', '*', '*', '*', 'auto'],
					body: [header, ...body],
				},
			},
		],
		marginBottom: 15,
	};
};

const generateExperienceInfo = (jobseeker: Jobseeker): Content => {
	if (!jobseeker.experiences || jobseeker.experiences.length === 0) return { text: '' };
	const header = [
		{ text: 'ক্রমিক নং', style: 'tableHeader' },
		{ text: 'প্রতিষ্ঠানের নাম', style: 'tableHeader' },
		{ text: 'চাকুরীর মেয়াদ', style: 'tableHeader' },
	];
	const body = jobseeker.experiences.map((exp, index) => {
		const endDate = exp.isCurrent
			? 'Present'
			: exp.resignDate
			? format(new Date(exp.resignDate), 'MMM yyyy')
			: '';
		const period = `${format(new Date(exp.joinDate), 'MMM yyyy')} - ${endDate}`;
		return [{ text: (index + 1).toString(), alignment: 'center' }, exp.organizationNameEn, period];
	});

	return {
		stack: [
			{ text: 'ঙ. অভিজ্ঞতা:', style: 'subheader' },
			{
				layout: 'lightHorizontalLines',
				table: {
					headerRows: 1,
					widths: ['auto', '*', '*'],
					body: [header, ...body],
				},
			},
		],
		marginBottom: 15,
	};
};

const generateSignature = (): Content => {
	return {
		stack: [{ text: 'স্বাক্ষর ও তারিখ', alignment: 'right', margin: [0, 40, 0, 0] }],
	};
};

export const generateCv = async (jobseeker: Jobseeker) => {
	const docDefinition: TDocumentDefinitions = {
		content: [
			await generateCvHeader(jobseeker),
			generateGeneralInfo(jobseeker),
			generateSpouseInfo(jobseeker),
			generateChildrenInfo(jobseeker),
			generateEducationInfo(jobseeker),
			generateExperienceInfo(jobseeker),
			generateSignature(),
		],
		images: {
			placeholder: location.origin + COMMON_URL.DUMMY_USER_AVATAR,
		},
	};

	generatePDF(docDefinition, { action: 'open', fileName: `iifc-cv-${jobseeker.personalInfo.fullName}.pdf` });
};
