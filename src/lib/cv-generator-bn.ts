import { COMMON_URL } from '@/constants/common.constant';
import { Jobseeker } from '@/interfaces/jobseeker.interface';
import { generatePDF } from '@/services/pdf/pdf.service';
import { format, parseISO } from 'date-fns';
import { Content, TableLayout, TDocumentDefinitions } from 'pdfmake/interfaces';
import { makePreviewURL } from './file-oparations';
import { convertEnToBn } from './translator';

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

const defautlTableLayout: TableLayout = {
	hLineWidth: () => 0.5,
	vLineWidth: () => 0.5,
	hLineColor: () => 'grey',
	vLineColor: () => 'grey',
};

const formatDateBn = (dateString: string) => {
	if (!dateString) return '';
	return convertEnToBn(format(parseISO(dateString), 'dd-MM-yyyy'));
};

const generateHeader = async (jobseeker: Jobseeker): Promise<Content> => {
	let imageDataUrl: string | undefined;

	if (jobseeker.personalInfo.profileImage?.filePath) {
		try {
			imageDataUrl = (await toDataURL(
				makePreviewURL(jobseeker.personalInfo.profileImage.filePath)
			)) as string;
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

	// @ts-ignore
	return {
		stack: [
			{
				columns: [
					{
						width: '*',
						text: '',
					},
					{
						width: 'auto',
						table: {
							body: [
								[
									{
										image: imageDataUrl,
										width: 80,
										height: 80,
										alignment: 'center',
									},
								],
							],
						},
						layout: defautlTableLayout,
					},
				],
			},
			{
				columns: [
					{ width: '*', text: '' },
					{ text: 'ব্যক্তিগত তথ্য', style: 'header', alignment: 'center' },
					{
						width: '*',
						table: {
							widths: ['*', 'auto'],
							body: [
								[
									{text: '', border: [false, false, false, false]},
									{
										text: `ক্রমিক নম্বর: ${convertEnToBn(jobseeker.personalInfo.id?.slice(-5) || '-')}`,
										bold: true,
										alignment: 'center',
										lineHeight: 1,
									},
								],
							],
						},
						alignment: 'right',
						margin: [0, 10, 0, 0],
					},
				],
			},
		],
	};
};

const generateSectionTable = (title: string, data: (string | undefined)[][]): Content => ({
	stack: [
		{ text: title, style: 'subheader' },
		{
			table: {
				widths: [100, '*'],
				body: data.map(([label, value]) => [
					{ text: label || '', lineHeight: 1, },
					// { text: ':', border: [false, true, false, true], alignment: 'center', margin: [0, 2] },
					{ text: value || '', lineHeight: 1, },
				]),
			},
			layout: defautlTableLayout,
		},
	],
	marginBottom: 15,
});

const generatePersonalInfo = (jobseeker: Jobseeker): Content => {
	const { personalInfo } = jobseeker;
	const permanentAddress =
		[
			personalInfo.permanentAddress,
			personalInfo.permanentUpazila?.nameBn,
			personalInfo.permanentDistrict?.nameBn,
		]
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
		['জন্ম তারিখ', formatDateBn(personalInfo.dateOfBirth)],
		['ধর্ম', personalInfo.religionDTO?.nameBn],
		['জাতীয় পরিচয়পত্র নম্বর', convertEnToBn(personalInfo.nid)],
		['বৈবাহিক অবস্থা', personalInfo.maritalStatusDTO?.nameBn],
		['মোবাইল নম্বর', convertEnToBn(personalInfo.phone)],
		['বর্তমান পেশাগত অবস্থা', personalInfo.organization?.nameBn],
		['স্থায়ী ঠিকানা', permanentAddress],
		['বর্তমান ঠিকানা/বাসস্থান', presentAddress],
	];

	return generateSectionTable('ক. সাধারণ তথ্য:', data);
};

// const generateSpouseInfo = (jobseeker: Jobseeker): Content => {
// 	const { familyInfo } = jobseeker;
// 	if (!familyInfo || !familyInfo.name) return [];

// 	const data = [
// 		['নাম', familyInfo.name],
// 		['পেশা', familyInfo.profession],
// 		['নিজ জেলা', jobseeker.personalInfo.permanentDistrict?.nameBn],
// 	];
// 	return generateSectionTable('খ. স্বামীর/স্ত্রীর তথ্য:', data);
// };

// const generateChildrenInfo = (jobseeker: Jobseeker): Content => {
// 	const { familyInfo } = jobseeker;
// 	if (!familyInfo || !familyInfo.children || familyInfo.children.length === 0) return [];
// 	return {
// 		stack: [
// 			{ text: 'গ. ছেলে মেয়ের বিবরণ:', style: 'subheader' },
// 			{
// 				table: {
// 					headerRows: 1,
// 					widths: ['auto', '*', 'auto', 'auto'],
// 					body: [
// 						['ক্রমিক নং', 'নাম', 'জন্ম তারিখ', 'লিঙ্গ'].map((h) => ({ text: h, style: 'tableHeader' })),
// 						...familyInfo.children.map((child, i) => [
// 							convertEnToBn(i + 1),
// 							child.name,
// 							formatDateBn(child.dob),
// 							child.genderDTO?.nameBn || '',
// 						]),
// 					],
// 				},
// 				layout: 'lightHorizontalLines',
// 			},
// 		],
// 		marginBottom: 15,
// 	};
// };

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
						['ক্রমিক নং', 'পরীক্ষা', 'বিষয়/বিভাগ', 'ফলাফল', 'শিক্ষা প্রতিষ্ঠানের নাম', 'পাসের সাল'].map((h) => ({
							text: h,
							style: 'tableHeader',
						})),
						...education.map((edu, i) => [
							convertEnToBn(i + 1),
							edu.degree?.nameBn,
							edu.subjectNameBn || edu.subjectNameEn,
							convertEnToBn(edu.cgpa),
							edu.institution.nameBn,
							convertEnToBn(edu.passingYear),
						]),
					],
				},
				layout: defautlTableLayout,
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
							convertEnToBn(i + 1),
							exp.organizationNameBn || exp.organizationNameEn,
							exp.isCurrent ? 'চলমান' : '-'
						]),
					],
				},
				layout: defautlTableLayout,
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
			// generateSpouseInfo(jobseeker),
			// generateChildrenInfo(jobseeker),
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
