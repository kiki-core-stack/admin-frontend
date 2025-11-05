import type {
    AdminLoginFormData,
    AdminQrCodeLoginData,
} from '@kiki-core-stack/pack/types/data/admin';
import type { AxiosRequestConfig } from 'axios';

import { BaseApi } from './_internals/base';

export class AuthApi extends BaseApi {
    constructor() {
        super('/api/admin/auth');
    }

    checkQrCodeLoginStatus(token: string, params?: any, config?: AxiosRequestConfig) {
        return this.postRequest<{ status: 'pending' | 'success' }>(
            '/login/qr-code/consume',
            {
                ...params,
                token,
            },
            config,
        );
    }

    confirmQrCodeLogin(token: string, data?: any, config?: AxiosRequestConfig) {
        return this.postRequest(`/login/qr-code/${token}/confirm`, data, config);
    }

    getQrCodeLoginData(token: string, params?: any, config?: AxiosRequestConfig) {
        return this.getRequest<Pick<AdminQrCodeLoginData, 'ip' | 'userAgent'>>(
            `/login/qr-code/${token}/info`,
            params,
            config,
        );
    }

    getQrCodeLoginToken(oldToken?: string) {
        return this.getRequest<{ token: string }>('/login/qr-code/token', { oldToken });
    }

    login(data: AdminLoginFormData) {
        return this.postRequest<undefined, 'invalidVerificationCode'>('/login', data);
    }

    logout() {
        return this.postRequest('/logout');
    }
}
