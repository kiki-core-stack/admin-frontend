import type { AdminChangePasswordData } from '@kiki-core-stack/pack/types/data/admin';

import { BaseApi } from '../../_internals/base';

export class ProfileSecurityApi extends BaseApi {
    constructor() {
        super('/api/admin/profile/security');
    }

    changePassword(data: AdminChangePasswordData) {
        return this.patchRequest('/password', data);
    }
}
