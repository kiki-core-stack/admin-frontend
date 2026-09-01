import type { AdminLogData } from '@kcs-project/pack/types/data/admin';

export class AdminLogApi extends BaseCrudApi<AdminLogData> {
    constructor() {
        super('/api/admin/admin/log');
    }
}
