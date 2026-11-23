import packMessages from '@kcs-project/pack/i18n/messages/zh-TW';

import adminPermissionMessages from '../../../../../app/generated/admin/permission/messages/zh-TW';
import type { LocaleMessages } from '../types';

export default {
    apiClientErrors: packMessages.apiClientErrors,
    common: {
        account: '帳號',
        actions: '操作',
        cancel: '取消',
        login: '登入',
        logout: '登出',
        password: '密碼',
        search: '搜尋',
    },
    enums: packMessages.enums,
    pages: {
        auth: {
            login: {
                passkeyLogin: '密碼金鑰登入',
                qrCodeLogin: 'QR Code 登入',
                title: '總後台登入',
            },
        },
    },
    permissions: { admin: adminPermissionMessages },
} satisfies LocaleMessages;
