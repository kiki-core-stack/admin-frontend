export class ProfileApi extends BaseApi {
    constructor() {
        super('/api/admin/profile');
    }

    get() {
        return this.getRequest<{ id: string }>();
    }
}
