import type { AdminChangePasswordData } from '@kcs-project/pack/types/data/admin';

export class ProfileSecurityApi extends BaseApi {
    constructor() {
        super('/api/admin/profile/security');
    }

    async changePassword(data: AdminChangePasswordData) {
        return await this.patchRequest('/password', data);
    }
}
