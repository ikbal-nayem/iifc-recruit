import { format } from 'date-fns';
import { ContextPageSize, TDocumentDefinitions } from 'pdfmake/interfaces';

const defaultPDFFooter = (currentPage: number, pageCount: number, pageSize: ContextPageSize) => {
	return [
		{
			columns: [
				{
					text: `Date: ${format(new Date(), 'dd/MM/yyyy hh:mm a')}`,
					fontSize: 9,
					color: '#555',
				},
				{
					text: 'IIFC Jobs',
					fontSize: 8,
					color: '#327632',
					alignment: 'center',
					marginTop: 3,
				},
				{
					text: `Page: ${currentPage.toString()}/${pageCount.toString()}`,
					fontSize: 9,
					alignment: 'right',
					color: '#555',
				},
			],
			marginTop: 5,
			marginLeft: 50,
			marginRight: 50,
		},
	];
};

export const defaultDef: TDocumentDefinitions = {
	pageSize: 'A4',
	pageMargins: [50, 50, 50, 50],
	content: [],
	info: {
		title: 'IIFC Report',
		author: 'IIFC',
		creator: 'IIFC Jobs',
		subject: 'IIFC Report',
	},
	footer: defaultPDFFooter as any,
	defaultStyle: {
		font: 'Kalpurush',
		fontSize: 9,
		color: '#2c2c2c',
	},
	styles: {
		header: {
			fontSize: 18,
			bold: true,
			marginBottom: 10,
		},
		subheader: {
			fontSize: 14,
			bold: true,
			marginBottom: 5,
		},
		tableHeader: {
			bold: true,
			fontSize: 11,
			color: 'black',
			fillColor: '#eeeeee',
			alignment: 'center',
		},
		small: {
			fontSize: 8,
		},
	},
};
