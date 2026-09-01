import type { AdminRoleData } from '@kcs-project/pack/types/data/admin';

export class AdminRoleApi extends BaseCrudApi<AdminRoleData> {
    constructor() {
        super('/api/admin/admin/role');
    }
}
