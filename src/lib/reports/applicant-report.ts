
import { generatePDF } from '@/services/pdf/pdf.service';
import { Application } from '@/interfaces/application.interface';
import { RequestedPost } from '@/interfaces/job.interface';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { format, parseISO } from 'date-fns';
import { convertEnToBn } from '../translator';

const generateReportHeader = (requestedPost: RequestedPost): Content => {
	return {
		stack: [
			{ text: 'Applicant Report', style: 'title', alignment: 'center' },
			{ text: requestedPost.jobRequest?.subject || 'Job Request', style: 'subtitle', alignment: 'center' },
			{
				columns: [
					{
						text: `Post: ${requestedPost.post?.nameBn}`,
						style: 'info',
					},
					{
						text: `Organization: ${requestedPost.jobRequest?.clientOrganization?.nameBn}`,
						style: 'info',
						alignment: 'right',
					},
				],
				margin: [0, 10, 0, 5],
			},
			{
				columns: [
					{
						text: `Vacancies: ${convertEnToBn(requestedPost.vacancy)}`,
						style: 'info',
					},
					{
						text: `Report Date: ${format(new Date(), 'dd MMM, yyyy')}`,
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
			{ text: 'SL', style: 'tableHeader' },
			{ text: 'Applicant Name', style: 'tableHeader' },
			{ text: 'Contact', style: 'tableHeader' },
			{ text: 'Applied On', style: 'tableHeader' },
			{ text: 'Status', style: 'tableHeader' },
			{ text: 'Marks', style: 'tableHeader' },
		],
	];

	// Table Rows
	applicants.forEach((app, index) => {
		body.push([
			convertEnToBn(index + 1),
			app.fullName,
			{ stack: [{ text: app.email }, { text: app.phone }] },
			format(parseISO(app.createdOn), 'dd-MM-yyyy'),
			app.statusDTO.nameEn,
			app.marks ? convertEnToBn(app.marks) : '-',
		]);
	});

	return {
		table: {
			headerRows: 1,
			widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
			body: body,
		},
		layout: 'lightHorizontalLines',
	};
};

export const generateApplicantReport = (requestedPost: RequestedPost, applicants: Application[]) => {
	const docDefinition: TDocumentDefinitions = {
		content: [generateReportHeader(requestedPost), generateApplicantTable(applicants)],
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
