import type { AdminLogData } from '@kiki-core-stack/pack/types/data/admin';

import { BaseCrudApi } from '../_internals/base/crud';

export class AdminLogApi extends BaseCrudApi<AdminLogData> {
    constructor() {
        super('/api/admin/admin/log');
    }
}
