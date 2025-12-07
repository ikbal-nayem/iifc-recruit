
import { format } from 'date-fns';
import nProgress from 'nprogress';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { defaultDef } from './default-conf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Correctly assign the virtual file system
if (pdfMake.vfs) {
	pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

const kalpurush = '/fonts/kalpurush-mod.ttf';
const kalpurush_bold = '/fonts/kalpurush-mod-bold.ttf';

pdfMake.fonts = {
	Roboto: {
		normal: 'Roboto-Regular.ttf',
		bold: 'Roboto-Medium.ttf',
		italics: 'Roboto-Italic.ttf',
		bolditalics: 'Roboto-MediumItalic.ttf',
	},
	Kalpurush: {
		normal: kalpurush,
		bold: kalpurush_bold,
		italics: kalpurush,
		bolditalics: kalpurush_bold,
	},
};

type IOptions = {
	action?: 'open' | 'print' | 'download' | 'data-url' | 'base64' | 'blob';
	progressCallback?: (progress: number | string) => void;
	fileName?: string;
	getValue?: (value: string | Blob | ArrayBuffer) => void;
};

const generatePDF = (docDefinition: TDocumentDefinitions, options?: IOptions) => {
	nProgress.start();
	docDefinition = {
		...defaultDef,
		...docDefinition,
	};
	const pdf = pdfMake.createPdf(docDefinition);
	const fileName = options?.fileName || `iifc-report-${format(new Date(), 'dd/MM/yyyy')}.pdf`;
	const progressCallback = options?.progressCallback;

	switch (options?.action) {
		case 'print':
			pdf.print({}, window);
			nProgress.done();
			break;
		case 'download':
			pdf.download(fileName, undefined);
			nProgress.done();
			break;
		case 'data-url':
			pdf.getDataUrl((res) => options?.getValue && options?.getValue(res));
			nProgress.done();
			break;
		case 'base64':
			pdf.getBase64((res) => options?.getValue && options?.getValue(res));
			nProgress.done();
			break;
		case 'blob':
			pdf.getBlob((res) => options?.getValue && options?.getValue(res));
			nProgress.done();
			break;
		default:
			pdf.open({}, window);
			nProgress.done();
	}
};

export { generatePDF };
