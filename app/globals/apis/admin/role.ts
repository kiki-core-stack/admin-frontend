import type { AdminRoleData } from '@kiki-core-stack/pack/types/data/admin';

export class AdminRoleApi extends BaseCrudApi<AdminRoleData> {
    constructor() {
        super('/api/admin/admin/role');
    }
}
