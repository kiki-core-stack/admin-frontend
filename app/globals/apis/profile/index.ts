import type { PrincipalPermissions } from '@kcs-project/pack/types/permission';

export class ProfileApi extends BaseApi {
    constructor() {
        super('/api/admin/profile');
    }

    async get() {
        return await this.getRequest<{ id: string; permission: PrincipalPermissions }>();
    }
}
