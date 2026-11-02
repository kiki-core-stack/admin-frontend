export class PublicApi extends BaseApi {
    constructor() {
        super('/api/public');
    }

    async clearClientCache() {
        return await this.postRequest('/client-cache/clear');
    }
}
