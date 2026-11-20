import type { UploadImageInput } from '@/globals/apis/upload';

export async function uploadImageAndGetFileId(input: UploadImageInput) {
    const response = await UploadApi.use().uploadImage(input);
    if (!response.data.data?.id) throw response;
    return response.data.data.id;
}

/**
 * Uploads the new images (`Blob`) of an image list and returns the file ids in order; existing ids are kept as is.
 */
export async function uploadImagesAndGetFileIds(images: ReadonlyArray<Blob | string>) {
    return await Promise.all(
        images.map(async (image) => image instanceof Blob ? await uploadImageAndGetFileId({ image }) : image),
    );
}
