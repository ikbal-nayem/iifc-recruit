
import { generatePDF } from '@/services/pdf/pdf.service';
import { Application } from '@/interfaces/application.interface';
import { RequestedPost } from '@/interfaces/job.interface';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { format, parseISO } from 'date-fns';
import { convertEnToBn } from '../translator';

const generateReportHeader = (requestedPost: RequestedPost, reportTitle: string, applicantCount: number): Content => {
	const postDetails: string[] = [];
	if (requestedPost.post?.nameBn) {
		postDetails.push(`পদ: ${requestedPost.post.nameBn}`);
	}
	if (requestedPost.post?.outsourcingCategory?.nameBn) {
		postDetails.push(`ক্যাটাগরি: ${requestedPost.post.outsourcingCategory.nameBn}`);
	}
	if (requestedPost.outsourcingZone?.nameBn) {
		postDetails.push(`জোন: ${requestedPost.outsourcingZone.nameBn}`);
	}

	return {
		stack: [
			{ text: reportTitle, style: 'title', alignment: 'center' },
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
				margin: [0, 10, 0, 5],
			},
			{
				columns: [
					{
						text: `পদ সংখ্যা: ${convertEnToBn(requestedPost.vacancy)} | মোট আবেদনকারী: ${convertEnToBn(
							applicantCount
						)}`,
						style: 'info',
					},
					{
						text: `রিপোর্টের তারিখ: ${convertEnToBn(format(new Date(), 'dd/MM/yyyy'))}`,
						style: 'info',
						alignment: 'right',
					},
				],
			},
		],
		marginBottom: 20,
	};
};

const generateApplicantTable = (applicants: Application[]): Content => {
	const body: any[][] = [
		// Table Header
		[
			{ text: 'ক্রমিক নং', style: 'tableHeader' },
			{ text: 'আবেদনকারীর নাম', style: 'tableHeader' },
			{ text: 'যোগাযোগ', style: 'tableHeader' },
			{ text: 'আবেদনের তারিখ', style: 'tableHeader' },
			{ text: 'Status', style: 'tableHeader' },
		],
	];

	// Table Rows
	applicants.forEach((app, index) => {
		body.push([
			convertEnToBn(index + 1),
			app.fullName,
			{ stack: [{ text: app.email }, { text: convertEnToBn(app.phone) }] },
			convertEnToBn(format(parseISO(app.createdOn), 'dd-MM-yyyy')),
			app.statusDTO.nameEn,
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
		content: [generateReportHeader(requestedPost, reportTitle, applicants.length), generateApplicantTable(applicants)],
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
				alignment: 'center',
			},
		},
		defaultStyle: {
			font: 'Kalpurush',
			fontSize: 9,
		},
	};

	generatePDF(docDefinition, {
		fileName: `Applicant_Report_${requestedPost.post?.nameEn.replace(/\s/g, '_')}.pdf`,
	});
};
