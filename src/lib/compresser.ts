import imageCompression from "browser-image-compression";

export const compressImage = async (
	imageFile: File,
	maxSizeMB: number = 0.3,
	maxWidthOrHeight: number = 1000,
	useWebWorker: boolean = true
) => {
	const options = {
		maxSizeMB: maxSizeMB,
		maxWidthOrHeight: maxWidthOrHeight,
		useWebWorker: useWebWorker,
	};

	try {
		const compressedFile = await imageCompression(imageFile, options);
		return await new File([compressedFile], imageFile.name, {
			type: compressedFile.type,
		});
	} catch (error) {
		throw new Error("Image not compressed!");
	}
};
