import type { AuthSecurityOverviewData } from '@kcs-project/pack/types/data/auth';

/**
 * Manages the security settings of an admin; needs the `admin.account.manageSecurity` permission.
 */
export class AdminSecurityApi extends BaseApi {
    constructor(adminId: string) {
        super(`/api/admin/admin/${adminId}/security`);
    }

    async getOverview() {
        return await this.getRequest<AuthSecurityOverviewData>();
    }

    async resetTwoFactor() {
        return await this.postRequest('/two-factor/reset');
    }

    async setTwoFactorEnforced(enforced: boolean) {
        return await this.patchRequest('/two-factor/enforced', { enforced });
    }
}
