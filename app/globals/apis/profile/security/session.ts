import type { AuthenticationSessionListItemData } from '@kcs-project/pack/types/data/authentication-session';

export class ProfileSecuritySessionApi extends BaseCrudApi<AuthenticationSessionListItemData, never> {
    constructor() {
        super('/api/admin/profile/security/session');
    }

    async deleteAll() {
        return await this.deleteRequest('/all');
    }
}
