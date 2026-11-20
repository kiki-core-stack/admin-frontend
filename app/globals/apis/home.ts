import type { GetHomeDashboardDataParams } from '@/types/home';

export class HomeApi extends BaseApi {
    constructor() {
        super('/api/admin/home');
    }

    async getDashboardData(params: GetHomeDashboardDataParams) {
        return await this.getRequest<object>(
            '/dashboard',
            {
                endAt: params.endAt.toISOString(),
                startAt: params.startAt.toISOString(),
            },
        );
    }
}
