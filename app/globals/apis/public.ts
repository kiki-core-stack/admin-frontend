export class PublicApi extends BaseApi {
    constructor() {
        super('/api/public');
    }

    clearClientCache() {
        return this.postRequest('/client-cache/clear');
    }
}
