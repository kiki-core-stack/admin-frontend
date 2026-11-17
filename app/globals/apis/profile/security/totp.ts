import type {
    AuthRecoveryCodesData,
    AuthTotpSetupData,
} from '@kcs-project/pack/types/data/auth';

export class ProfileSecurityTotpApi extends BaseApi {
    constructor() {
        super('/api/admin/profile/security/totp');
    }

    async confirm(challengeId: string, code: string) {
        return await this.postRequest<AuthRecoveryCodesData>(
            '/confirm',
            {
                challengeId,
                code,
            },
        );
    }

    async remove() {
        return await this.deleteRequest();
    }

    async setup() {
        return await this.postRequest<AuthTotpSetupData>('/setup');
    }
}
