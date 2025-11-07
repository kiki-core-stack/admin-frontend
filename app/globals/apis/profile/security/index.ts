import type { AdminChangePasswordData } from '@kiki-core-stack/pack/types/data/admin';

export class ProfileSecurityApi extends BaseApi {
    constructor() {
        super('/api/admin/profile/security');
    }

    changePassword(data: AdminChangePasswordData) {
        return this.patchRequest('/password', data);
    }
}
