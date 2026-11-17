import type { AuthSessionData } from '@kcs-project/pack/types/data/auth';

export class ProfileSecuritySessionApi extends BaseCrudApi<AuthSessionData, never> {
    constructor() {
        super('/api/admin/profile/security/session');
    }

    async deleteOthers() {
        return await this.deleteRequest('/others');
    }
}
