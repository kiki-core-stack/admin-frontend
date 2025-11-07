import type { AdminSessionData } from '@kiki-core-stack/pack/types/data/admin';

export class ProfileSecuritySessionApi extends BaseCrudApi<AdminSessionData> {
    constructor() {
        super('/api/admin/profile/security/session');
    }

    deleteAll() {
        return this.deleteRequest('/delete-all');
    }
}
