import type { AdminSessionData } from '@kiki-core-stack/pack/types/data/admin';

import { BaseCrudApi } from '../../_internals/base/crud';

export class ProfileSecuritySessionApi extends BaseCrudApi<AdminSessionData> {
    constructor() {
        super('/api/profile/security/session');
    }
}
