import type {
    AuthChangePasswordData,
    AuthSecurityOverviewData,
} from '@kcs-project/pack/types/data/auth';

export class ProfileSecurityApi extends BaseApi {
    constructor() {
        super('/api/admin/profile/security');
    }

    async changePassword(data: AuthChangePasswordData) {
        return await this.patchRequest('/password', data);
    }

    async getOverview() {
        return await this.getRequest<AuthSecurityOverviewData>();
    }

    async regenerateRecoveryCodes() {
        return await this.postRequest<{ recoveryCodes: string[] }>('/recovery-code/regenerate');
    }

    async setTwoFactorEnabled(enabled: boolean) {
        return await this.patchRequest('/two-factor/enabled', { enabled });
    }
}
