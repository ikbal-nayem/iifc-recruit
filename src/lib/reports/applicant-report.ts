import { COMMON_URL } from '@/constants/common.constant';
import { Application } from '@/interfaces/application.interface';
import { RequestedPost } from '@/interfaces/job.interface';
import { generatePDF } from '@/services/pdf/pdf.service';
import { format, parseISO } from 'date-fns';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { toDataURL } from '../pdf-utils';
import { convertEnToBn } from '../translator';

const generateReportHeader = async (requestedPost: RequestedPost): Promise<Content> => {
	let logoDataUrl: string | undefined;
	try {
		logoDataUrl = (await toDataURL(COMMON_URL.SITE_LOGO)) as string;
	} catch (error) {
		console.error('Could not fetch logo for report header:', error);
	}

	const postDetails: string[] = [];
	if (requestedPost.post?.nameBn) {
		postDetails.push(`পদ: ${requestedPost.post.nameBn}`);
	}
	if (requestedPost.post?.outsourcingCategory?.nameBn) {
		postDetails.push(`ক্যাটাগরি: ${requestedPost.post.outsourcingCategory.nameBn}`);
	}

	return {
		stack: [
			{
				columns: [
					{
						image: logoDataUrl,
						width: 60,
						alignment: 'left',
					},
					{
						stack: [
							{ text: 'IIFC Outsourcing Jobs', style: 'title' },
							{
								text: 'JDPC Bhaban (3rd floor), 145, Monipurpara, Tejgaon, Dhaka-1215, Bangladesh.',
								style: 'subtitle',
							},
							{ text: '+88 02 223 34093-96  |  info@iifc.gov.bd', style: 'subtitle',}
						],
					},
				],
				columnGap: 10,
				marginBottom: 5,
			},
			{
				canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }],
				marginBottom: 10,
			},
			{
				columns: [
					{
						text: `প্রতিষ্ঠান: ${requestedPost.jobRequest?.clientOrganization?.nameBn}`,
						style: 'info',
					},
					{
						text: `পদ সংখ্যা: ${convertEnToBn(requestedPost.vacancy)}`,
						style: 'info',
						alignment: 'right',
					},
				],
			},
			{
				columns: [
					{
						text: postDetails.join(' | '),
						style: 'info',
					},
					{
						text: `জোন: ${requestedPost?.outsourcingZone?.nameBn || '-'}`,
						style: 'info',
						alignment: 'right',
					},
				],
			},
		],
		marginBottom: 10,
	};
};

const generateApplicantTable = (applicants: Application[]): Content => {
	const body: any[][] = [
		// Table Header
		[
			{ text: 'ক্রমিক', style: 'tableHeader', alignment: 'center' },
			{ text: 'আবেদনকারীর নাম', style: 'tableHeader' },
			{ text: 'যোগাযোগ', style: 'tableHeader' },
			{ text: 'আবেদনের তারিখ', style: 'tableHeader' },
			{ text: 'অবস্থা', style: 'tableHeader', alignment: 'center' },
		],
	];

	// Table Rows
	applicants.forEach((app, index) => {
		body.push([
			{ text: convertEnToBn(index + 1), alignment: 'center' },
			app.fullName,
			{ stack: [{ text: app.email }, { text: convertEnToBn(app.phone) }] },
			convertEnToBn(format(parseISO(app.createdOn), 'dd-MM-yyyy')),
			{ text: app.statusDTO.nameEn, alignment: 'center', font: 'Roboto' },
		]);
	});

	return {
		table: {
			headerRows: 1,
			widths: ['auto', '*', 'auto', 'auto', 'auto'],
			body: body,
		},
		layout: 'lightHorizontalLines',
	};
};

export const generateApplicantReport = async (
	requestedPost: RequestedPost,
	applicants: Application[],
	reportTitle: string
) => {
	const docDefinition: TDocumentDefinitions = {
		content: [
			await generateReportHeader(requestedPost),
			{
				text: `মোট: ${convertEnToBn(applicants.length)} জন`,
				alignment: 'center',
				marginBottom: 5,
				fontSize: 11,
			},
			generateApplicantTable(applicants),
		],
		header: {
			text: `[${reportTitle}]`,
			alignment: 'right',
			font: 'Roboto',
			margin: [0, 20, 40, 0],
		},
		styles: {
			title: {
				font: 'Roboto',
				fontSize: 16,
				bold: true,
				margin: [0, 5, 0, 5]
			},
			subtitle: {
				font: 'Roboto',
				fontSize: 10,
				color: '#444444',
			},
			info: {
				fontSize: 9,
				color: '#333333',
			},
			tableHeader: {
				bold: true,
				fontSize: 10,
				color: 'black',
				fillColor: '#eeeeee',
			},
		},
	};

	generatePDF(docDefinition, {
		fileName: `Applicant_Report_${requestedPost.post?.nameEn.replace(/\s/g, '_')}.pdf`,
	});
};
