import type { AdminLogData } from '@kiki-core-stack/pack/types/data/admin';

export class AdminLogApi extends BaseCrudApi<AdminLogData> {
    constructor() {
        super('/api/admin/admin/log');
    }
}
