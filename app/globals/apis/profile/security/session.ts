import type { AuthenticationSessionListItemData } from '@kiki-core-stack/pack/types/data/authentication-session';

export class ProfileSecuritySessionApi extends BaseCrudApi<AuthenticationSessionListItemData> {
    constructor() {
        super('/api/admin/profile/security/session');
    }

    deleteAll() {
        return this.deleteRequest('/all');
    }
}
