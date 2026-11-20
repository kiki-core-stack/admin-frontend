import type { AxiosRequestConfig } from 'axios';

export interface UploadImageInput {
    /**
     * Required to upload a GIF; the backend rejects GIFs otherwise.
     */
    allowGif?: boolean;
    config?: AxiosRequestConfig;
    image: Blob;
}

export class UploadApi extends BaseApi {
    constructor() {
        super('/api/admin/upload');
    }

    async uploadImage(input: UploadImageInput) {
        const formData = new FormData();
        formData.append('file', input.image);
        return await this.postRequest<{ id: string }>(
            '/image',
            formData,
            merge(input.config ?? {}, { params: { allowGif: input.allowGif } }),
        );
    }
}
