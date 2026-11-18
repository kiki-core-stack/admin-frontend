import type {
    AuthSecurityOverviewData,
    AuthSessionData,
} from '@kcs-project/pack/types/data/auth';

/**
 * Manages the security settings and sessions of an account of any realm. `basePath` is where the backend forwards the
 * pack auth management routes for that account, e.g. `/api/admin/admin/<id>/security`.
 */
export class PrincipalSecurityApi extends BaseApi {
    constructor(basePath: string) {
        super(basePath);
    }

    async getOverview() {
        return await this.getRequest<AuthSecurityOverviewData>();
    }

    async getSessions() {
        return await this.getRequest<{ list: AuthSessionData[] }>('/session/list');
    }

    async resetTwoFactor() {
        return await this.postRequest('/two-factor/reset');
    }

    async revokeAllSessions() {
        return await this.deleteRequest('/session/all');
    }

    async revokeSession(sessionId: string) {
        return await this.deleteRequest(`/session/${sessionId}`);
    }

    async setTwoFactorEnforced(enforced: boolean) {
        return await this.patchRequest('/two-factor/enforced', { enforced });
    }
}
