import type { PackMessages } from '@kcs-project/pack/i18n/messages/types';

import type { AdminPermissionMessages } from '../../../../app/generated/admin/permission';

/**
 * Pack messages are included only where the frontend shows them; API errors and validation issues arrive already
 * localized by the backend.
 */
export interface LocaleMessages extends Pick<PackMessages, 'apiClientErrors' | 'enums'> {
    common: {
        account: string;
        actions: string;
        cancel: string;
        login: string;
        logout: string;
        password: string;
        search: string;
    };

    pages: {
        auth: {
            login: {
                passkeyLogin: string;
                qrCodeLogin: string;
                title: string;
            };
        };
    };

    permissions: {
        admin: AdminPermissionMessages;
    };
}

declare module 'vue-i18n' {
    export interface DefineLocaleMessage extends LocaleMessages {}
}
