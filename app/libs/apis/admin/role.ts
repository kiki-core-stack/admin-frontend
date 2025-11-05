import type { AdminRoleData } from '@kiki-core-stack/pack/types/data/admin';

import { BaseCrudApi } from '../_internals/base/crud';

export class AdminRoleApi extends BaseCrudApi<AdminRoleData> {
    constructor() {
        super('/api/admin/admin/role');
    }
}
