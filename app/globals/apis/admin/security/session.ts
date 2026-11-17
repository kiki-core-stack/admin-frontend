import type { AuthSessionData } from '@kcs-project/pack/types/data/auth';

export class AdminSecuritySessionApi extends BaseCrudApi<AuthSessionData, never> {
    constructor(adminId: string) {
        super(`/api/admin/admin/${adminId}/security/session`);
    }

    async deleteAll() {
        return await this.deleteRequest('/all');
    }
}
