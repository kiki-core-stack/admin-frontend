import type { AdminLogData } from '@kcs-project/pack/types/data/admin';

import type { GetAdminLogListFilter } from '@/types/admin';

export class AdminLogApi extends BaseCrudApi<AdminLogData> {
    constructor() {
        super('/api/admin/admin/log');
    }

    // Protected methods
    protected override buildQueryFilter(filter: GetAdminLogListFilter) {
        return super.buildQueryFilter({
            ...filter,
            adminObjectId: {
                ...filter.adminObjectId,
                $in: filter.adminObjectId?.$in?.map((admin) => admin.id),
            },
        });
    }
}
