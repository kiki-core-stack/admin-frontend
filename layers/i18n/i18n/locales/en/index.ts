import packMessages from '@kcs-project/pack/i18n/messages/en';

import adminPermissionMessages from '../../../../../app/generated/admin/permission/messages/en';
import type { LocaleMessages } from '../types';

export default {
    apiClientErrors: packMessages.apiClientErrors,
    common: {
        account: 'Account',
        actions: 'Actions',
        cancel: 'Cancel',
        login: 'Log in',
        logout: 'Log out',
        password: 'Password',
        search: 'Search',
    },
    enums: packMessages.enums,
    pages: {
        auth: {
            login: {
                passkeyLogin: 'Log in with a passkey',
                qrCodeLogin: 'Log in with a QR code',
                title: 'Admin login',
            },
        },
    },
    permissions: { admin: adminPermissionMessages },
} satisfies LocaleMessages;
