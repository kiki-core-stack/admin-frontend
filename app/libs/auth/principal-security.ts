import type {
    AuthEventData,
    AuthSecurityOverviewData,
    AuthSessionData,
} from '@kcs-project/pack/types/data/auth';

export class PrincipalSecurityApi extends BaseApi {
    constructor(basePath: string) {
        super(basePath);
    }

    async getEvents(page: number, limit: number) {
        return await this.getRequest<{ count: number; list: AuthEventData[] }>(
            '/event/list',
            {
                limit,
                page,
            },
        );
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
