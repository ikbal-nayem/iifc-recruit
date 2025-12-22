import { Application } from '@/interfaces/application.interface';
import { RequestedPost } from '@/interfaces/job.interface';
import { generatePDF } from '@/services/pdf/pdf.service';
import { format, parseISO } from 'date-fns';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { convertEnToBn } from '../translator';

const generateReportHeader = (requestedPost: RequestedPost): Content => {
	const postDetails: string[] = [];
	if (requestedPost.post?.nameBn) {
		postDetails.push(`পদ: ${requestedPost.post.nameBn}`);
	}
	if (requestedPost.post?.outsourcingCategory?.nameBn) {
		postDetails.push(`ক্যাটাগরি: ${requestedPost.post.outsourcingCategory.nameBn}`);
	}

	return {
		stack: [
			{ text: 'IIFC Outsourcing Jobs', font: 'Roboto', style: 'title', alignment: 'center' },
			{ text: requestedPost.jobRequest?.subject || ' ', style: 'subtitle', alignment: 'center' },
			{
				columns: [
					{
						text: postDetails.join(' | '),
						style: 'info',
					},
					{
						text: `প্রতিষ্ঠান: ${requestedPost.jobRequest?.clientOrganization?.nameBn}`,
						style: 'info',
						alignment: 'right',
					},
				],
				marginTop: 10,
			},
			{
				columns: [
					{
						text: `পদ সংখ্যা: ${convertEnToBn(requestedPost.vacancy)}`,
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
			{text: app.statusDTO.nameEn, alignment: 'center', font: 'Roboto' },
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

export const generateApplicantReport = (
	requestedPost: RequestedPost,
	applicants: Application[],
	reportTitle: string
) => {
	const docDefinition: TDocumentDefinitions = {
		content: [
			generateReportHeader(requestedPost),
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
				fontSize: 18,
				bold: true,
			},
			subtitle: {
				fontSize: 14,
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
