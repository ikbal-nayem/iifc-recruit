
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

const enToBn = (num: any) => {
	if (num === null || num === undefined || num === '') return '';
	return num
		.toString()
		.replaceAll('0', '০')
		.replaceAll('1', '১')
		.replaceAll('2', '২')
		.replaceAll('3', '৩')
		.replaceAll('4', '৪')
		.replaceAll('5', '৫')
		.replaceAll('6', '৬')
		.replaceAll('7', '৭')
		.replaceAll('8', '৮')
		.replaceAll('9', '৯');
};

const formatDateBn = (dateString: string) => {
	if (!dateString) return '';
	return enToBn(format(parseISO(dateString), 'dd-MM-yyyy'));
};

const generateHeader = async (jobseeker: Jobseeker): Promise<Content> => {
	let imageDataUrl: string | undefined;

	if (jobseeker.personalInfo.profileImage?.filePath) {
		try {
			imageDataUrl = (await toDataURL(makePreviewURL(jobseeker.personalInfo.profileImage.filePath))) as string;
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

	return {
		columns: [
			{
				width: '*',
				text: '',
			},
			{
				width: 'auto',
				stack: [
					{
						text: 'ব্যক্তিগত তথ্য',
						style: 'header',
						alignment: 'center',
						margin: [0, 0, 0, 20],
					},
				],
			},
			{
				width: '*',
				stack: [
					{
						table: {
							body: [
								[
									{
										text: 'পাসপোর্ট সাইজ\nছবি-০১ কপি',
										alignment: 'center',
										margin: [10, 20],
									},
								],
							],
						},
						width: 100,
						height: 120,
						alignment: 'right',
					},
					{
						table: {
							widths: ['auto', '*'],
							body: [
								[
									'ক্রমিক নম্বর:',
									{
										text: `${enToBn(jobseeker.personalInfo.id?.slice(-5) || 'N/A')}`,
										bold: true,
										alignment: 'center',
									},
								],
							],
						},
						width: 120,
						alignment: 'right',
						margin: [0, 10, 0, 0],
					},
				],
			},
		],
		marginBottom: 10,
	};
};

const generateSectionTable = (title: string, data: (string | undefined)[][]): Content => ({
	stack: [
		{ text: title, style: 'subheader' },
		{
			table: {
				widths: ['auto', 'auto', '*'],
				body: data.map(([label, value]) => [
					{ text: label || '', border: [true, true, false, true], alignment: 'left', margin: [5, 2] },
					{ text: ':', border: [false, true, false, true], alignment: 'center', margin: [0, 2] },
					{ text: value || '', border: [false, true, true, true], alignment: 'left', margin: [5, 2] },
				]),
			},
			layout: {
				hLineWidth: (i) => (i === 0 ? 1 : 0.5),
				vLineWidth: (i) => (i === 0 ? 1 : 0.5),
				hLineColor: (i) => (i === 0 ? 'black' : 'grey'),
				vLineColor: (i) => (i === 0 ? 'black' : 'grey'),
			},
		},
	],
	marginBottom: 15,
});

const generatePersonalInfo = (jobseeker: Jobseeker): Content => {
	const { personalInfo } = jobseeker;
	const permanentAddress =
		[personalInfo.permanentAddress, personalInfo.permanentUpazila?.nameBn, personalInfo.permanentDistrict?.nameBn]
			.filter(Boolean)
			.join(', ') || '';
	const presentAddress =
		[personalInfo.presentAddress, personalInfo.presentUpazila?.nameBn, personalInfo.presentDistrict?.nameBn]
			.filter(Boolean)
			.join(', ') || '';

	const data = [
		['নাম', personalInfo.fullName],
		['পিতার নাম', personalInfo.fatherName],
		['মাতার নাম', personalInfo.motherName],
		['স্থায়ী ঠিকানা', permanentAddress],
		['জন্ম তারিখ', formatDateBn(personalInfo.dateOfBirth)],
		['ধর্ম', personalInfo.religionDTO?.nameBn],
		['জাতীয় পরিচয়পত্র নম্বর', enToBn(personalInfo.nid)],
		['বৈবাহিক অবস্থা', personalInfo.maritalStatusDTO?.nameBn],
		['মোবাইল নম্বর', enToBn(personalInfo.phone)],
		['বর্তমান পেশাগত অবস্থা', personalInfo.organization?.nameBn],
		['বর্তমান ঠিকানা/বাসস্থান', presentAddress],
	];

	return generateSectionTable('ক. সাধারণ তথ্য:', data);
};

const generateSpouseInfo = (jobseeker: Jobseeker): Content => {
	const { familyInfo } = jobseeker;
	if (!familyInfo || !familyInfo.name) return [];

	const data = [
		['নাম', familyInfo.name],
		['পেশা', familyInfo.profession],
		['নিজ জেলা', jobseeker.personalInfo.permanentDistrict?.nameBn],
	];
	return generateSectionTable('খ. স্বামীর/স্ত্রীর তথ্য:', data);
};

const generateChildrenInfo = (jobseeker: Jobseeker): Content => {
	const { familyInfo } = jobseeker;
	if (!familyInfo || !familyInfo.children || familyInfo.children.length === 0) return [];
	return {
		stack: [
			{ text: 'গ. ছেলে মেয়ের বিবরণ:', style: 'subheader' },
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*', 'auto', 'auto'],
					body: [
						['ক্রমিক নং', 'নাম', 'জন্ম তারিখ', 'লিঙ্গ'].map((h) => ({ text: h, style: 'tableHeader' })),
						...familyInfo.children.map((child, i) => [
							enToBn(i + 1),
							child.name,
							formatDateBn(child.dob),
							child.genderDTO?.nameBn || '',
						]),
					],
				},
				layout: 'lightHorizontalLines',
			},
		],
		marginBottom: 15,
	};
};

const generateEducation = (jobseeker: Jobseeker): Content => {
	const { education } = jobseeker;
	if (!education || education.length === 0) return [];

	return {
		stack: [
			{ text: 'ঘ. শিক্ষাগত যোগ্যতা:', style: 'subheader' },
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*', '*', '*', 'auto'],
					body: [
						['ক্রমিক নং', 'পরীক্ষা', 'ফলাফল', 'শিক্ষা প্রতিষ্ঠানের নাম', 'পাসের সাল'].map((h) => ({
							text: h,
							style: 'tableHeader',
						})),
						...education.map((edu, i) => [
							enToBn(i + 1),
							edu.degreeLevel.nameBn,
							enToBn(edu.cgpa),
							edu.institution.nameBn,
							enToBn(edu.passingYear),
						]),
					],
				},
				layout: 'lightHorizontalLines',
			},
		],
		marginBottom: 15,
	};
};

const generateExperience = (jobseeker: Jobseeker): Content => {
	const { experiences } = jobseeker;
	if (!experiences || experiences.length === 0) return [];
	return {
		stack: [
			{ text: 'ঙ. অভিজ্ঞতা:', style: 'subheader' },
			{
				table: {
					headerRows: 1,
					widths: ['auto', '*', 'auto'],
					body: [
						['ক্রমিক নং', 'প্রতিষ্ঠানের নাম', 'চাকুরীর মেয়াদ'].map((h) => ({
							text: h,
							style: 'tableHeader',
						})),
						...experiences.map((exp, i) => [
							enToBn(i + 1),
							exp.organizationNameBn || exp.organizationNameEn,
							exp.isCurrent ? 'চলমান' : 'N/A', // Placeholder for duration
						]),
					],
				},
				layout: 'lightHorizontalLines',
			},
		],
		marginBottom: 15,
	};
};

export const generateCvBn = async (jobseeker: Jobseeker) => {
	const docDefinition: TDocumentDefinitions = {
		content: [
			await generateHeader(jobseeker),
			generatePersonalInfo(jobseeker),
			generateSpouseInfo(jobseeker),
			generateChildrenInfo(jobseeker),
			generateEducation(jobseeker),
			generateExperience(jobseeker),
			{
				text: 'স্বাক্ষর ও তারিখ',
				alignment: 'right',
				margin: [0, 60, 0, 0],
				style: 'signature',
			},
		],
		styles: {
			header: { fontSize: 16, bold: true },
			subheader: { fontSize: 12, bold: true, margin: [0, 0, 0, 5] },
			signature: { fontSize: 11 },
			tableHeader: { bold: true, fontSize: 11, alignment: 'center' },
		},
		defaultStyle: {
			font: 'Kalpurush',
			fontSize: 11,
			lineHeight: 1.3,
		},
	};

	generatePDF(docDefinition, { action: 'open', fileName: `CV_BN-${jobseeker.personalInfo.fullName}.pdf` });
};
