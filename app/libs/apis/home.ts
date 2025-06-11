import type { GetHomeDashboardDataFilter } from '@/types/home';

import { BaseApi } from './_internals/base';

export class HomeApi extends BaseApi {
    constructor() {
        super('/api/home');
    }

    getDashboardData(filter: GetHomeDashboardDataFilter) {
        return this.getRequest<object>('/dashboard', { filter: buildApiQueryFilter(filter) });
    }
}
