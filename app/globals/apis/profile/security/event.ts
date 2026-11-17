import type { AuthEventData } from '@kcs-project/pack/types/data/auth';

export class ProfileSecurityEventApi extends BaseCrudApi<AuthEventData, never> {
    constructor() {
        super('/api/admin/profile/security/event');
    }
}
