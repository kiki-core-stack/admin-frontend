import type { ClientApiErrorCode } from '@kcs-project/pack/types/api';

export interface AppLocaleMessages {
    common: {
        account: string;
        actions: string;
        cancel: string;
        login: string;
        logout: string;
        password: string;
        search: string;
    };

    /**
     * Messages of client-side failures only; API errors carry their own localized message.
     */
    errors: Record<ClientApiErrorCode, string> & {
        /**
         * The server answered with something other than an API envelope (e.g. a proxy error page).
         */
        invalidResponse: string;
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
    export interface DefineLocaleMessage extends AppLocaleMessages {}
}
