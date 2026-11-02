import type { GetHomeDashboardDataFilter } from '@/types/home';

export class HomeApi extends BaseApi {
    constructor() {
        super('/api/admin/home');
    }

    async getDashboardData(filter: GetHomeDashboardDataFilter) {
        return await this.getRequest<object>('/dashboard', { filter: this.buildQueryFilter(filter) });
    }
}
