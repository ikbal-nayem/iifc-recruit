
export const isFileImage = (fileType: string) =>
	fileType.startsWith('image/') && !fileType.includes('svg');
export const isFilePdf = (fileType: string) => fileType === 'application/pdf';
