import type { GetHomeDashboardDataFilter } from '@/types/home';

export class HomeApi extends BaseApi {
    constructor() {
        super('/api/admin/home');
    }

    getDashboardData(filter: GetHomeDashboardDataFilter) {
        return this.getRequest<object>('/dashboard', { filter: this.buildQueryFilter(filter) });
    }
}
