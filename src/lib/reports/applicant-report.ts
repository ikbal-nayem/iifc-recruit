import { Application } from '@/interfaces/application.interface';
import { RequestedPost } from '@/interfaces/job.interface';
import { generatePDF } from '@/services/pdf/pdf.service';
import { format, parseISO } from 'date-fns';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { convertEnToBn } from '../translator';
import { COMMON_URL } from '@/constants/common.constant';
import { toDataURL } from '../pdf-utils';

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
							{ text: 'IIFC Outsourcing Jobs', style: 'title', alignment: 'center' },
							{ text: requestedPost.jobRequest?.subject || ' ', style: 'subtitle', alignment: 'center' },
						],
						alignment: 'center',
					},
					{
						text: `তারিখ: ${convertEnToBn(format(new Date(), 'dd/MM/yyyy'))}`,
						style: 'info',
						alignment: 'right',
						width: 'auto',
					},
				],
				columnGap: 10,
				marginBottom: 10,
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
			{ text: `মোট: ${convertEnToBn(applicants.length)} জন`, alignment: 'center', marginBottom: 5, fontSize: 11 },
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
				fontSize: 16,
				bold: true,
			},
			subtitle: {
				fontSize: 12,
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
