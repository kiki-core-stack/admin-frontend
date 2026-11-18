import type {
    AuthLoginResultData,
    AuthPasswordLoginData,
    AuthQrCodeLoginCreationData,
    AuthQrCodeLoginInfoData,
    AuthSentCodeData,
} from '@kcs-project/pack/types/data/auth';
import type { AuthenticationResponseJSON } from '@simplewebauthn/browser';
import type { AxiosRequestConfig } from 'axios';

import type {
    AuthFactorProofData,
    AuthPasskeyAuthenticationOptionsData,
} from '@/types/data/auth';

export class AuthApi extends BaseApi {
    constructor() {
        super('/api/admin/auth');
    }

    async approveQrCodeLogin(qrToken: string, config?: AxiosRequestConfig) {
        return await this.postRequest('/login/qr-code/approve', { qrToken }, config);
    }

    async createQrCodeLogin(config?: AxiosRequestConfig) {
        return await this.postRequest<AuthQrCodeLoginCreationData>('/login/qr-code', undefined, config);
    }

    /**
     * Verifies the admin for a high-risk operation; the returned one-time grant is sent along with that operation.
     */
    async createVerification(operation: string, proof: AuthFactorProofData) {
        return await this.postRequest<{ grant: string }>(
            '/verification',
            {
                operation,
                proof,
            },
        );
    }

    async getLoginPasskeyOptions() {
        return await this.postRequest<AuthPasskeyAuthenticationOptionsData>('/login/passkey/options');
    }

    async getQrCodeLoginInfo(qrToken: string, config?: AxiosRequestConfig) {
        return await this.postRequest<AuthQrCodeLoginInfoData>('/login/qr-code/info', { qrToken }, config);
    }

    async getSecondFactorPasskeyOptions(challengeId: string) {
        return await this.postRequest<AuthPasskeyAuthenticationOptionsData>(
            '/login/second-factor/passkey-options',
            { challengeId },
        );
    }

    async getVerificationPasskeyOptions() {
        return await this.postRequest<AuthPasskeyAuthenticationOptionsData>('/verification/passkey-options');
    }

    async login(data: AuthPasswordLoginData) {
        return await this.postRequest<AuthLoginResultData>('/login', data);
    }

    async loginWithPasskey(challengeId: string, response: AuthenticationResponseJSON) {
        return await this.postRequest<AuthLoginResultData>(
            '/login/passkey',
            {
                challengeId,
                response,
            },
        );
    }

    async loginWithSecondFactor(challengeId: string, proof: AuthFactorProofData) {
        return await this.postRequest<AuthLoginResultData>(
            '/login/second-factor',
            {
                challengeId,
                proof,
            },
        );
    }

    async logout() {
        return await this.postRequest('/logout');
    }

    async pollQrCodeLogin(qrToken: string, pollSecret: string, config?: AxiosRequestConfig) {
        return await this.postRequest<{ state: 'completed' | 'pending' | 'rejected' }>(
            '/login/qr-code/poll',
            {
                pollSecret,
                qrToken,
            },
            config,
        );
    }

    async rejectQrCodeLogin(qrToken: string, config?: AxiosRequestConfig) {
        return await this.postRequest('/login/qr-code/reject', { qrToken }, config);
    }

    /**
     * Sends the admin a verification code to verify a high-risk operation with; only for accounts without a second
     * factor, in realms that send codes.
     */
    async sendVerificationCode() {
        return await this.postRequest<AuthSentCodeData>('/verification/send-code');
    }
}
