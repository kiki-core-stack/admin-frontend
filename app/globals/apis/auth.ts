import type { AdminLoginFormData } from '@kiki-core-stack/pack/types/data/admin';
import type {
    AuthenticationSessionQrCodeLoginApprovalRequestData,
    AuthenticationSessionQrCodeLoginCreationData,
} from '@kiki-core-stack/pack/types/data/authentication-session';
import type { AxiosRequestConfig } from 'axios';

export class AuthApi extends BaseApi {
    constructor() {
        super('/api/admin/auth');
    }

    approveQrCodeLogin(approvalToken: string, config?: AxiosRequestConfig) {
        return this.postRequest('/login/qr-code/approve', { approvalToken }, config);
    }

    completeQrCodeLogin(completionToken: string, config?: AxiosRequestConfig) {
        return this.postRequest<{ state: 'completed' | 'pending' }>(
            '/login/qr-code/complete',
            { completionToken },
            config,
        );
    }

    createQrCodeLogin(config?: AxiosRequestConfig) {
        return this.postRequest<AuthenticationSessionQrCodeLoginCreationData>('/login/qr-code', undefined, config);
    }

    getQrCodeLoginApprovalRequest(approvalToken: string, config?: AxiosRequestConfig) {
        return this.postRequest<AuthenticationSessionQrCodeLoginApprovalRequestData>(
            '/login/qr-code/info',
            { approvalToken },
            config,
        );
    }

    login(data: AdminLoginFormData) {
        return this.postRequest('/login', data);
    }

    logout() {
        return this.postRequest('/logout');
    }
}
