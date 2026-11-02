import type { AdminLoginFormData } from '@kcs-project/pack/types/data/admin';
import type {
    AuthenticationSessionQrCodeLoginApprovalRequestData,
    AuthenticationSessionQrCodeLoginCreationData,
} from '@kcs-project/pack/types/data/authentication-session';
import type { AxiosRequestConfig } from 'axios';

export class AuthApi extends BaseApi {
    constructor() {
        super('/api/admin/auth');
    }

    async approveQrCodeLogin(approvalToken: string, config?: AxiosRequestConfig) {
        return await this.postRequest('/login/qr-code/approve', { approvalToken }, config);
    }

    async completeQrCodeLogin(completionToken: string, config?: AxiosRequestConfig) {
        return await this.postRequest<{ state: 'completed' | 'pending' }>(
            '/login/qr-code/complete',
            { completionToken },
            config,
        );
    }

    async createQrCodeLogin(config?: AxiosRequestConfig) {
        return await this.postRequest<AuthenticationSessionQrCodeLoginCreationData>('/login/qr-code', undefined, config);
    }

    async getQrCodeLoginApprovalRequest(approvalToken: string, config?: AxiosRequestConfig) {
        return await this.postRequest<AuthenticationSessionQrCodeLoginApprovalRequestData>(
            '/login/qr-code/info',
            { approvalToken },
            config,
        );
    }

    async login(data: AdminLoginFormData) {
        return await this.postRequest('/login', data);
    }

    async logout() {
        return await this.postRequest('/logout');
    }
}
