import type { CommonApiResponseErrorCode } from '@kiki-core-stack/pack/hono-backend/types/api';

import type { ApiResponseErrorCode } from '@/types/api';

export interface LocaleMessages {
    common: {
        account: string;
        actions: string;
        cancel: string;
        login: string;
        logout: string;
        password: string;
        search: string;
        verCode: string;
    };

    errors: { apiResponse: { code: Record<ApiResponseErrorCode | CommonApiResponseErrorCode, string> } };
    messages: {
        pleaseCheckNetwork: string;
    };

    pages: {
        auth: {
            login: {
                qrCodeLogin: string;
                title: string;
            };
        };
    };
}

declare module 'vue-i18n' {
    export interface DefineLocaleMessage extends LocaleMessages {}
}
