import type { AuthRecoveryCodesData } from '@kcs-project/pack/types/data/auth';
import type { RegistrationResponseJSON } from '@simplewebauthn/browser';

import type { AuthPasskeyRegistrationOptionsData } from '@/types/data/auth';

export class ProfileSecurityPasskeyApi extends BaseApi {
    constructor() {
        super('/api/admin/profile/security/passkey');
    }

    async getRegistrationOptions() {
        return await this.postRequest<AuthPasskeyRegistrationOptionsData>('/registration-options');
    }

    async register(challengeId: string, name: string, response: RegistrationResponseJSON) {
        return await this.postRequest<AuthRecoveryCodesData>(
            undefined,
            {
                challengeId,
                name,
                response,
            },
        );
    }

    async remove(id: string) {
        return await this.deleteRequest(`/${encodeURIComponent(id)}`);
    }

    async rename(id: string, name: string) {
        return await this.patchRequest(`/${encodeURIComponent(id)}`, { name });
    }
}
